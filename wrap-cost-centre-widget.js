import { Desktop } from '@wxcc-desktop/sdk';

const template = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;
      padding: 16px;
      color: #1f2937;
      background: #ffffff;
      font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    .form { display: grid; gap: 12px; }
    label { display: grid; gap: 6px; color: #374151; font-size: 12px; font-weight: 650; }
    select {
      width: 100%;
      min-height: 38px;
      padding: 8px 34px 8px 10px;
      border: 1px solid #c7d2e2;
      border-radius: 6px;
      color: #111827;
      background: #fff;
      font: inherit;
    }
    select:focus, button:focus-visible { outline: 3px solid rgba(37, 99, 235, .22); outline-offset: 1px; }
    button {
      min-height: 38px;
      border: 0;
      border-radius: 6px;
      color: #fff;
      background: #2563eb;
      font: 650 13px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      cursor: pointer;
    }
    button:hover { background: #1d4ed8; }
    button:disabled { cursor: wait; opacity: .65; }
    .status {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  </style>
  <form class="form">
    <label>
      Wrap reason
      <select name="wrapReason" required>
        <option value="Resolved">Resolved</option>
        <option value="Follow-up required">Follow-up required</option>
        <option value="Customer unavailable">Customer unavailable</option>
        <option value="Transferred">Transferred</option>
        <option value="Duplicate contact">Duplicate contact</option>
      </select>
    </label>
    <label>
      Cost centre
      <select name="costCentre" required>
        <option value="CC-100 · Customer Care">CC-100 · Customer Care</option>
        <option value="CC-210 · Technical Support">CC-210 · Technical Support</option>
        <option value="CC-320 · Billing">CC-320 · Billing</option>
        <option value="CC-410 · Retention">CC-410 · Retention</option>
      </select>
    </label>
    <button type="submit">Apply</button>
    <div class="status" role="status" aria-live="polite"></div>
  </form>
`;

class WrapCostCentreWidget extends HTMLElement {
  constructor() {
    super();
    this._task = null;
    this._sdkReady = false;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
    this._form = this.shadowRoot.querySelector('form');
    this._button = this.shadowRoot.querySelector('button');
    this._status = this.shadowRoot.querySelector('.status');
    this._form.addEventListener('submit', (event) => this._apply(event));
  }

  // Agent Desktop maps $STORE.agentContact.taskSelected to this property.
  set task(value) {
    this._task = value;
    this._setStatus('');
  }

  get task() {
    return this._task;
  }

  async connectedCallback() {
    try {
      await Desktop.config.init('wrap-cost-centre-widget', 'cisco');
      this._sdkReady = true;
    } catch (error) {
      this._setStatus('');
      console.error('[wrap-cost-centre-widget] Desktop SDK initialization failed', error);
    }
  }

  _interactionId() {
    return this._task?.interactionId
      || this._task?.interaction?.interactionId
      || this._task?.interaction?.id
      || this._task?.id
      || '';
  }

  async _apply(event) {
    event.preventDefault();
    const interactionId = this._interactionId();
    if (!interactionId || !this._sdkReady) {
      this._setStatus('');
      return;
    }

    const values = new FormData(this._form);
    this._button.disabled = true;
    try {
      await Desktop.dialer.updateCadVariables({
        interactionId,
        data: {
          attributes: {
            AP_Wrap_Reason: values.get('wrapReason'),
            AP_Cost_Centre: values.get('costCentre'),
          },
        },
      });
      this._setStatus('');
    } catch (error) {
      this._setStatus('');
      console.error('[wrap-cost-centre-widget] CAD update failed', error);
    } finally {
      this._button.disabled = false;
    }
  }

  _setStatus(message) {
    this._status.textContent = message;
  }
}

customElements.define('wrap-cost-centre-widget', WrapCostCentreWidget);
