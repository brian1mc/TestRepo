import { Desktop } from '@wxcc-desktop/sdk';

const WIDGET_NAME = 'chat-inactivity-widget';
const WRAP_UP_NAME = 'customer abandoned';
const INACTIVITY_THRESHOLDS = [60, 180, 300];
const TICK_MS = 1000;

const template = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;
      padding: 16px;
      color: var(--md-primary-text-color, #202d3d);
      background: var(--md-primary-bg-color, #f7f9fc);
      color-scheme: light;
      font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    :host([data-theme="dark"]) { color: #e8edf5; background: #151d29; color-scheme: dark; }
    @media (prefers-color-scheme: dark) {
      :host:not([data-theme="light"]) { color: #e8edf5; background: #151d29; color-scheme: dark; }
    }
    .shell { max-width: 430px; margin: 0 auto; }
    .heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
    .eyebrow { color: #64748b; font-size: 10px; font-weight: 750; letter-spacing: .1em; text-transform: uppercase; }
    h2 { margin: 4px 0 0; font-size: 17px; line-height: 1.2; }
    :host([data-theme="dark"]) .eyebrow { color: #91a0b4; }
    .badge { display: inline-flex; align-items: center; gap: 6px; min-height: 24px; padding: 4px 8px; border-radius: 999px; color: #64748b; background: #e9eef6; font-size: 11px; font-weight: 700; white-space: nowrap; }
    .badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; }
    .badge.monitoring { color: #087443; background: #dff7eb; }
    .badge.monitoring::before { background: #12a66a; }
    .badge.warning { color: #976a04; background: #fff3d4; }
    .badge.warning::before { background: #d99b13; }
    .badge.ended, .badge.error { color: #b42318; background: #fee4e2; }
    .badge.ended::before, .badge.error::before { background: #ef4444; }
    :host([data-theme="dark"]) .badge { color: #a8b5c8; background: #243143; }
    :host([data-theme="dark"]) .badge.monitoring { color: #8de1ba; background: #153d31; }
    :host([data-theme="dark"]) .badge.warning { color: #f3cd70; background: #463719; }
    :host([data-theme="dark"]) .badge.ended, :host([data-theme="dark"]) .badge.error { color: #ffaaa4; background: #4d2527; }
    @media (prefers-color-scheme: dark) {
      :host:not([data-theme="light"]) .badge { color: #a8b5c8; background: #243143; }
      :host:not([data-theme="light"]) .badge.monitoring { color: #8de1ba; background: #153d31; }
      :host:not([data-theme="light"]) .badge.warning { color: #f3cd70; background: #463719; }
      :host:not([data-theme="light"]) .badge.ended, :host:not([data-theme="light"]) .badge.error { color: #ffaaa4; background: #4d2527; }
    }
    .card { display: grid; gap: 13px; padding: 15px; border: 1px solid var(--md-divider-color, #dce4ef); border-radius: 10px; background: var(--md-secondary-white-bg-color, #fff); box-shadow: 0 3px 12px rgba(20, 42, 72, .06); }
    :host([data-theme="dark"]) .card { border-color: #2d3b4e; background: #1c2736; box-shadow: 0 8px 22px rgba(0, 0, 0, .18); }
    @media (prefers-color-scheme: dark) { :host:not([data-theme="light"]) .card { border-color: #2d3b4e; background: #1c2736; box-shadow: 0 8px 22px rgba(0, 0, 0, .18); } }
    .metric { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
    .metric-label { color: #667085; font-size: 12px; }
    .metric-value { font: 750 24px/1 ui-monospace, SFMono-Regular, Menlo, monospace; }
    :host([data-theme="dark"]) .metric-label { color: #9aa9bc; }
    .progress { height: 7px; overflow: hidden; border-radius: 99px; background: #e8eef6; }
    .progress-bar { width: 0%; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #12a66a, #f0ad1b, #ef4444); transition: width .3s ease; }
    :host([data-theme="dark"]) .progress { background: #2d3b4e; }
    .timeline { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .checkpoint { padding: 9px 8px; border: 1px solid #dce4ef; border-radius: 7px; color: #667085; background: #f8fafc; font-size: 11px; text-align: center; }
    .checkpoint.done { color: #087443; border-color: #a6e5c6; background: #effbf5; }
    :host([data-theme="dark"]) .checkpoint { color: #9aa9bc; border-color: #40516a; background: #202d3e; }
    :host([data-theme="dark"]) .checkpoint.done { color: #8de1ba; border-color: #27694e; background: #153d31; }
    .context, .hint { color: #667085; font-size: 11px; line-height: 1.45; }
    .context { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    :host([data-theme="dark"]) .context, :host([data-theme="dark"]) .hint { color: #9aa9bc; }
    .status { min-height: 16px; color: #667085; font-size: 12px; }
    .status.error { color: #b42318; }
    :host([data-theme="dark"]) .status { color: #9aa9bc; }
    :host([data-theme="dark"]) .status.error { color: #ffaaa4; }
  </style>
  <div class="shell">
    <div class="heading">
      <div>
        <div class="eyebrow">Live chat safeguard</div>
        <h2>Customer inactivity monitor</h2>
      </div>
      <div class="badge" data-state-badge>Waiting</div>
    </div>
    <div class="card">
      <div class="metric">
        <span class="metric-label" data-metric-label>Time since interaction activity</span>
        <span class="metric-value" data-elapsed>—</span>
      </div>
      <div class="progress" aria-hidden="true"><div class="progress-bar" data-progress></div></div>
      <div class="timeline" aria-label="Inactivity checkpoints">
        <div class="checkpoint" data-checkpoint="60">1 min</div>
        <div class="checkpoint" data-checkpoint="180">3 min</div>
        <div class="checkpoint" data-checkpoint="300">5 min</div>
      </div>
      <div class="context" data-context>No selected chat interaction.</div>
      <div class="hint">Customer or agent message activity resets the timer. At 5 minutes, the chat ends automatically and is wrapped as “customer abandoned”.</div>
      <div class="status" role="status" aria-live="polite" data-status>Waiting for a live chat interaction.</div>
    </div>
  </div>
`;

class ChatInactivityWidget extends HTMLElement {
  static get observedAttributes() {
    return ['darkmode', 'dark-mode'];
  }

  constructor() {
    super();
    this._task = null;
    this._interactionId = '';
    this._taskId = '';
    this._lastCustomerActivityAt = 0;
    this._timerStartedAt = 0;
    this._timer = null;
    this._taskPollTimer = null;
    this._taskPollInFlight = false;
    this._desktopActivityHandler = (event) => this._handleDesktopActivity(event);
    this._activityBridgeHandler = (event) => this._handleActivityBridgeEvent(event);
    this._activityEventNames = [
      'wxcc-chat-message',
      'wxcc-task-message',
      'chat-message',
      'task-message',
      'task-message:appended',
      'task-message:sent',
    ];
    this._interactionStates = new Map();
    this._lastInboundActivityKey = '';
    this._sdkReady = false;
    this._closing = false;
    this._notified = new Set();
    this._wrapUpCode = null;
    this._contactHandler = (event) => this._handleContactEvent(event);
    this._endedHandler = (event) => this._handleTerminalEvent(event);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
    this._badge = this.shadowRoot.querySelector('[data-state-badge]');
    this._elapsed = this.shadowRoot.querySelector('[data-elapsed]');
    this._progress = this.shadowRoot.querySelector('[data-progress]');
    this._context = this.shadowRoot.querySelector('[data-context]');
    this._status = this.shadowRoot.querySelector('[data-status]');
    this._checkpoints = [...this.shadowRoot.querySelectorAll('[data-checkpoint]')];
  }

  set task(value) {
    const nextId = this._readInteractionId(value);
    if (nextId !== this._interactionId) {
      this._saveInteractionState();
      this._stopTimer();
      this._interactionId = nextId;
      this._taskId = this._readTaskId(value) || nextId;
      this._task = value || null;
      this._notified = new Set();
      this._closing = false;
      this._wrapUpCode = null;
      this._restoreInteractionState(this._task);
      this._startTaskTimer();
      return;
    }

    this._task = value || null;
    this._taskId = this._readTaskId(value) || this._taskId || this._interactionId;
    this._consumeInboundActivity(this._readInboundActivity(value));
    this._render();
  }

  get task() {
    return this._task;
  }

  set darkMode(value) {
    this._applyThemeValue(value);
  }

  get darkMode() {
    return this.getAttribute('data-theme') === 'dark';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this._applyThemeValue(newValue);
  }

  async connectedCallback() {
    this._applyInitialAttributeTheme();
    this._startTaskTimer();
    try {
      await Desktop.config.init(WIDGET_NAME, 'cisco');
      this._sdkReady = true;
      Desktop.agentContact.addEventListener('eAgentContact', this._contactHandler);
      Desktop.agentContact.addEventListener('eAgentContactEnded', this._endedHandler);
      Desktop.agentContact.addEventListener('eAgentContactWrappedUp', this._endedHandler);
      this._startTaskPoller();
      this._startDesktopActivityObservers();
      this._render();
    } catch (error) {
      this._setState('error', 'SDK unavailable');
      this._setStatus('Could not connect to Webex Agent Desktop.');
      console.error(`[${WIDGET_NAME}] Desktop SDK initialization failed`, error);
    }
  }

  disconnectedCallback() {
    this._stopTimer();
    this._stopTaskPoller();
    this._stopDesktopActivityObservers();
    if (!this._sdkReady) return;
    Desktop.agentContact?.removeEventListener('eAgentContact', this._contactHandler);
    Desktop.agentContact?.removeEventListener('eAgentContactEnded', this._endedHandler);
    Desktop.agentContact?.removeEventListener('eAgentContactWrappedUp', this._endedHandler);
  }

  _applyThemeValue(value) {
    const normalized = typeof value === 'string' ? value.toLowerCase() : value;
    if (value === true || normalized === true || normalized === 'true' || normalized === 'dark' || normalized === '') {
      this.setAttribute('data-theme', 'dark');
    } else if (value === false || normalized === false || normalized === 'false' || normalized === 'light') {
      this.setAttribute('data-theme', 'light');
    } else {
      this.removeAttribute('data-theme');
    }
  }

  _applyInitialAttributeTheme() {
    const themeAttribute = this.getAttribute('darkmode') ?? this.getAttribute('dark-mode');
    if (themeAttribute !== null) this._applyThemeValue(themeAttribute);
  }

  _saveInteractionState() {
    if (!this._interactionId || !this._lastCustomerActivityAt) return;
    this._interactionStates.set(this._interactionId, {
      lastActivityAt: this._lastCustomerActivityAt,
      lastInboundActivityKey: this._lastInboundActivityKey,
      notified: [...this._notified],
    });
  }

  _restoreInteractionState(task) {
    const saved = this._interactionStates.get(this._interactionId);
    const inbound = this._readInboundActivity(task);
    this._lastCustomerActivityAt = saved?.lastActivityAt
      || inbound?.at
      || this._readInteractionStartedAt(task)
      || Date.now();
    this._timerStartedAt = this._lastCustomerActivityAt;
    this._lastInboundActivityKey = saved?.lastInboundActivityKey || inbound?.key || '';
    this._notified = new Set(saved?.notified || []);
  }

  _consumeInboundActivity(activity) {
    if (!activity || (activity.key && activity.key === this._lastInboundActivityKey)) return;
    if (activity.at && activity.at <= this._lastCustomerActivityAt && activity.key === this._lastInboundActivityKey) return;
    this._lastInboundActivityKey = activity.key || `inbound:${activity.at}`;
    this._markCustomerActivity(activity.at || Date.now(), this._lastInboundActivityKey);
  }

  _startTaskTimer() {
    if (!this._interactionId) {
      this._render();
      return;
    }
    if (!this._isChatTask(this._task)) {
      this._setState('', 'Not a chat');
      this._setStatus('This widget monitors live chat interactions only.');
      this._render();
      return;
    }
    if (!this._lastCustomerActivityAt) this._restoreInteractionState(this._task);
    if (!this._timer) this._timer = window.setInterval(() => this._tick(), TICK_MS);
    this._render();
  }

  _stopTimer() {
    if (this._timer) window.clearInterval(this._timer);
    this._timer = null;
  }

  _startTaskPoller() {
    if (this._taskPollTimer || !Desktop.actions?.getTaskMap) return;
    this._taskPollTimer = window.setInterval(() => this._pollTaskMap(), 2000);
    void this._pollTaskMap();
  }

  _stopTaskPoller() {
    if (this._taskPollTimer) window.clearInterval(this._taskPollTimer);
    this._taskPollTimer = null;
  }

  _startDesktopActivityObservers() {
    document.addEventListener('input', this._desktopActivityHandler, true);
    document.addEventListener('keydown', this._desktopActivityHandler, true);
    document.addEventListener('submit', this._desktopActivityHandler, true);
    document.addEventListener('click', this._desktopActivityHandler, true);
    window.addEventListener('message', this._activityBridgeHandler, true);
    this._activityEventNames.forEach((name) => {
      window.addEventListener(name, this._activityBridgeHandler, true);
      document.addEventListener(name, this._activityBridgeHandler, true);
    });
  }

  _stopDesktopActivityObservers() {
    document.removeEventListener('input', this._desktopActivityHandler, true);
    document.removeEventListener('keydown', this._desktopActivityHandler, true);
    document.removeEventListener('submit', this._desktopActivityHandler, true);
    document.removeEventListener('click', this._desktopActivityHandler, true);
    window.removeEventListener('message', this._activityBridgeHandler, true);
    this._activityEventNames.forEach((name) => {
      window.removeEventListener(name, this._activityBridgeHandler, true);
      document.removeEventListener(name, this._activityBridgeHandler, true);
    });
  }

  _handleDesktopActivity(event) {
    if (!this._isChatTask(this._task) || this._closing || this._isInsideWidget(event.target)) return;
    const target = event.composedPath?.()[0] || event.target;
    const description = this._describeElement(target);
    if (event.type === 'input' && this._isChatEditor(target, description)) {
      this._markInteractionActivity();
      return;
    }
    if (event.type === 'keydown' && this._isChatEditor(target, description) && this._isEntryKey(event)) {
      this._markInteractionActivity();
      return;
    }
    if ((event.type === 'submit' || event.type === 'click') && this._isSendControl(target, description)) {
      this._markInteractionActivity();
    }
  }

  _handleActivityBridgeEvent(event) {
    if (!this._isChatTask(this._task) || this._closing) return;
    const payload = event?.type === 'message' ? this._parseMessageData(event.data) : this._unwrapEvent(event);
    if (!payload || !this._payloadLooksLikeMessage(payload)) return;
    const eventId = this._readInteractionId(payload) || this._readTaskId(payload);
    if (eventId && eventId !== this._interactionId && eventId !== this._taskId) return;
    this._markInteractionActivity();
  }

  _parseMessageData(data) {
    if (data && typeof data === 'object') return data;
    if (typeof data !== 'string') return null;
    try {
      const parsed = JSON.parse(data);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }

  _payloadLooksLikeMessage(payload) {
    if (!payload || typeof payload !== 'object') return false;
    const serialized = (() => {
      try {
        return JSON.stringify(payload).toLowerCase();
      } catch {
        return '';
      }
    })();
    return Boolean(
      payload.message
      || payload.messageText
      || payload.text
      || payload.messageId
      || payload.messageDirection
      || payload.senderType
      || payload.channelParams
      || /chat[-_: ]message|task[-_: ]message|message[-_: ](appended|sent|received)/i.test(serialized)
    );
  }

  _isEntryKey(event) {
    return event.key === 'Enter' || (event.key?.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey);
  }

  _isChatEditor(target, description) {
    const isTextControl = target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target?.isContentEditable;
    return Boolean(isTextControl && (target instanceof HTMLTextAreaElement
      || target instanceof HTMLInputElement
      || target?.isContentEditable
      || /chat|message|reply|composer|conversation|response|text/i.test(description)));
  }

  _isSendControl(target, description) {
    const role = target?.getAttribute?.('role') || '';
    const tagName = target?.tagName || '';
    return (tagName === 'BUTTON' || role === 'button' || target?.closest?.('button'))
      && /send|reply|message|chat|submit/i.test(description);
  }

  _describeElement(target) {
    if (!target) return '';
    const parts = [];
    let node = target;
    for (let depth = 0; node && depth < 4; depth += 1) {
      if (node.getAttribute) {
        parts.push(node.id, node.className, node.getAttribute('aria-label'), node.getAttribute('placeholder'), node.getAttribute('data-testid'), node.getAttribute('data-cy'));
      }
      node = node.parentElement || node.getRootNode?.().host || null;
    }
    return parts.filter(Boolean).join(' ').toLowerCase();
  }

  _isInsideWidget(node) {
    if (!node) return false;
    return node === this || node.getRootNode?.() === this.shadowRoot || this.contains?.(node);
  }

  _markInteractionActivity() {
    if (!this._isChatTask(this._task) || this._closing) return;
    this._markCustomerActivity(Date.now());
  }

  async _pollTaskMap() {
    if (this._taskPollInFlight || !this._isChatTask(this._task)) return;
    this._taskPollInFlight = true;
    try {
      const taskMap = await Desktop.actions.getTaskMap();
      const tasks = taskMap instanceof Map
        ? [...taskMap.entries()].map(([key, task]) => ({ key, task }))
        : Object.entries(taskMap || {}).map(([key, task]) => ({ key, task }));
      const selected = this._interactionId
        ? tasks.find(({ key, task }) => (this._readInteractionId(task) || key) === this._interactionId)
        : (tasks.filter(({ task }) => this._isChatTask(task)).length === 1
          ? tasks.find(({ task }) => this._isChatTask(task))
          : null);
      const currentTask = selected?.task;
      const currentId = selected ? (this._readInteractionId(currentTask) || selected.key) : '';
      if (currentTask && currentId && currentId !== this._interactionId) {
        this.task = currentTask;
        return;
      }
      if (!this._interactionId && currentTask && currentId) {
        this.task = currentTask;
        return;
      }
      this._consumeInboundActivity(this._readInboundActivity(currentTask));
    } catch (error) {
      console.warn(`[${WIDGET_NAME}] task map polling failed`, error);
    } finally {
      this._taskPollInFlight = false;
    }
  }

  _tick() {
    if (!this._isChatTask(this._task) || this._closing || !this._lastCustomerActivityAt) return;
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - this._lastCustomerActivityAt) / 1000));
    for (const threshold of INACTIVITY_THRESHOLDS) {
      if (elapsedSeconds >= threshold && !this._notified.has(threshold)) {
        this._notified.add(threshold);
        this._notify(threshold);
      }
    }
    this._render(elapsedSeconds);
    if (elapsedSeconds >= INACTIVITY_THRESHOLDS.at(-1)) void this._closeAbandonedChat();
  }

  async _closeAbandonedChat() {
    if (this._closing || !this._sdkReady || !this._interactionId) return;
    this._closing = true;
    this._stopTimer();
    this._setState('warning', 'Ending chat…');
    this._setStatus('Ending the inactive chat and applying the customer abandoned wrap-up.');
    try {
      const code = await this._findWrapUpCode();
      if (!code?.id || !code?.name) throw new Error(`Wrap-up code "${WRAP_UP_NAME}" is not configured for this agent.`);

      await Desktop.agentContact.endV2({ interactionId: this._interactionId });
      await Desktop.agentContact.wrapupV2({
        interactionId: this._interactionId,
        data: {
          wrapUpReason: code.name,
          auxCodeId: code.id,
          isAutoWrapup: true,
        },
      });
      this._setState('ended', 'Chat ended');
      this._setStatus(`Ended automatically and wrapped as “${code.name}”.`);
      this._render(INACTIVITY_THRESHOLDS.at(-1));
    } catch (error) {
      this._closing = false;
      this._setState('error', 'Action failed');
      this._setStatus(error?.message || 'Could not end and wrap up the chat.');
      console.error(`[${WIDGET_NAME}] automatic chat close failed`, error);
      this._render();
    }
  }

  async _findWrapUpCode() {
    if (this._wrapUpCode) return this._wrapUpCode;
    const target = WRAP_UP_NAME.toLowerCase();
    const modernApi = Desktop.agentConfigJsApi?.fetchPaginatedAuxCodes;
    if (modernApi) {
      for (let page = 0; page < 100; page += 1) {
        const response = await modernApi.call(Desktop.agentConfigJsApi, {
          workType: 'WRAP_UP_CODE',
          page,
          pageSize: 100,
          search: WRAP_UP_NAME,
          customFilter: '',
        });
        const codes = Array.isArray(response) ? response : (response?.data || []);
        const match = codes.find((code) => String(code?.name || '').trim().toLowerCase() === target);
        if (match) return (this._wrapUpCode = match);
        if (!response?.meta || page + 1 >= Number(response.meta.totalPages || 0)) break;
      }
    }

    const legacyCodes = await Desktop.actions?.getWrapUpCodes?.();
    const codes = Array.isArray(legacyCodes) ? legacyCodes : [];
    this._wrapUpCode = codes.find((code) => String(code?.name || '').trim().toLowerCase() === target) || null;
    return this._wrapUpCode;
  }

  _notify(threshold) {
    const minutes = threshold / 60;
    const finalWarning = threshold === INACTIVITY_THRESHOLDS.at(-1);
    const raw = {
      data: {
        type: finalWarning ? 'error' : 'warn',
        mode: 'autodismiss',
        title: finalWarning ? 'Chat will end automatically' : 'Customer chat is inactive',
        data: {
          type: 'chat',
          text: finalWarning
            ? 'No customer activity for 5 minutes. This chat will end and be wrapped as customer abandoned.'
            : `No customer activity detected for ${minutes} minute${minutes === 1 ? '' : 's'}.`,
          taskId: this._interactionId,
          iconDetail: {
            iconName: finalWarning ? 'icon-error_16' : 'icon-alert-active_16',
            color: finalWarning ? 'red' : 'blue',
          },
        },
      },
    };

    try {
      if (Desktop.actions?.fireGeneralAutoDismissNotification) {
        void Desktop.actions.fireGeneralAutoDismissNotification(raw).catch((error) => {
          console.warn(`[${WIDGET_NAME}] auto-dismiss notification failed`, error);
          Desktop.actions.fireGeneralSilentNotification?.(raw);
        });
      } else {
        Desktop.actions?.fireGeneralSilentNotification?.(raw);
      }
    } catch (error) {
      console.warn(`[${WIDGET_NAME}] notification failed`, error);
    }
  }

  _handleContactEvent(event) {
    if (!this._isMatchingEvent(event)) return;
    const payload = this._unwrapEvent(event);
    this._consumeInboundActivity(this._readInboundActivity(payload));
  }

  _handleTerminalEvent(event) {
    if (!this._isMatchingEvent(event)) return;
    this._stopTimer();
    this._closing = true;
    this._setState('ended', 'Chat ended');
    this._setStatus('The interaction has ended.');
    this._render();
  }

  _markCustomerActivity(activityAt = Date.now(), activityKey = '') {
    this._lastCustomerActivityAt = activityAt;
    this._timerStartedAt = activityAt;
    if (activityKey) this._lastInboundActivityKey = activityKey;
    this._notified = new Set();
    this._closing = false;
    this._wrapUpCode = null;
    this._setState('monitoring', 'Monitoring');
    this._setStatus('Interaction activity received. Inactivity timer restarted.');
    this._render(0);
  }

  _isChatTask(task) {
    const channel = String(
      task?.mediaType
      || task?.mediaChannel
      || task?.channel
      || task?.channelType
      || task?.type
      || task?.data?.mediaType
      || task?.data?.mediaChannel
      || task?.data?.channelType
      || task?.data?.interaction?.mediaType
      || task?.interaction?.mediaType
      || ''
    ).toLowerCase();
    return channel === 'chat' || channel.includes('chat');
  }

  _readInteractionId(value) {
    return value?.interactionId
      || value?.data?.interactionId
      || value?.interaction?.interactionId
      || value?.data?.interaction?.interactionId
      || value?.interaction?.id
      || value?.data?.interaction?.id
      || value?.id
      || value?.data?.id
      || '';
  }

  _readTaskId(value) {
    return value?.taskId
      || value?.data?.taskId
      || value?.payload?.taskId
      || value?.task?.taskId
      || '';
  }

  _readInboundActivity(value, depth = 0, seen = new WeakSet()) {
    if (!value || typeof value !== 'object' || depth > 6 || seen.has(value)) return null;
    seen.add(value);

    const directKeys = [
      'lastCustomerActivityAt', 'customerLastActivityAt', 'lastCustomerMessageAt',
      'customerLastMessageAt', 'customerActivityAt', 'lastInboundMessageAt',
      'lastCustomerMessageTime', 'customerLastMessageTime',
    ];
    for (const key of directKeys) {
      const parsed = this._parseTime(value[key]);
      if (parsed) return { at: parsed, key: `${key}:${value[key]}` };
    }

    const direction = String(
      value.messageDirection
      || value.direction
      || value.senderType
      || value.participantType
      || value.actorType
      || value.role
      || ''
    ).toLowerCase();
    const explicitInbound = direction.includes('inbound')
      || direction.includes('customer')
      || direction.includes('consumer')
      || direction.includes('received');
    const eventType = String(value.eventType || value.type || value.name || '').toLowerCase();
    const inboundMessageEvent = /(?:message|chat).*(?:received|incoming|inbound|customer)|(?:received|incoming|inbound|customer).*(?:message|chat)/i.test(eventType);
    const messageLike = Boolean(
      value.message
      || value.messageText
      || value.customerMessage
      || value.inboundMessage
      || value.channelParams?.message
      || value.messageId
      || value.messageDirection
    );
    if ((explicitInbound && messageLike) || inboundMessageEvent) {
      const at = this._parseTime(value.createdTime)
        || this._parseTime(value.eventTime)
        || this._parseTime(value.timestamp)
        || this._parseTime(value.message?.timestamp)
        || this._parseTime(value.channelParams?.message?.timestamp)
        || 0;
      const messageId = value.messageId
        || value.message?.messageId
        || value.channelParams?.message?.messageId
        || value.channelParams?.message?.aliasId
        || value.id
        || '';
      if (at || messageId) return {
        at: at || Date.now(),
        key: messageId ? `message:${messageId}` : `message-time:${at}`,
      };
    }

    for (const nested of [
      value.data,
      value.payload,
      value.task,
      value.interaction,
      value.contact,
      value.details,
      value.event,
      value.messages,
      value.message,
      value.channelParams,
    ]) {
      const activity = this._readInboundActivity(nested, depth + 1, seen);
      if (activity) return activity;
    }
    return null;
  }

  _readInteractionStartedAt(value) {
    if (!value || typeof value !== 'object') return 0;
    const directKeys = ['createdTimestamp', 'createdAt', 'startedAt', 'startTime', 'assignedAt', 'assignmentTimestamp'];
    for (const key of directKeys) {
      const parsed = this._parseTime(value[key]);
      if (parsed) return parsed;
    }
    for (const nested of [value.data, value.payload, value.task, value.interaction]) {
      const parsed = this._readInteractionStartedAt(nested);
      if (parsed) return parsed;
    }
    return 0;
  }

  _parseTime(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return value < 1e12 ? value * 1000 : value;
    if (typeof value === 'string' && value.trim()) {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) return numeric < 1e12 ? numeric * 1000 : numeric;
      const parsed = Date.parse(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return 0;
  }

  _unwrapEvent(event) {
    const candidate = event?.detail || event || {};
    if (candidate?.data && typeof candidate.data === 'object') return candidate.data;
    if (candidate?.payload && typeof candidate.payload === 'object') return candidate.payload;
    return candidate;
  }

  _isMatchingEvent(event) {
    const payload = this._unwrapEvent(event);
    const eventId = this._readInteractionId(payload) || this._readTaskId(payload);
    return Boolean(eventId && (eventId === this._interactionId || eventId === this._taskId));
  }

  _render(elapsedSeconds = null) {
    const isChat = this._isChatTask(this._task);
    const elapsed = elapsedSeconds === null && this._lastCustomerActivityAt
      ? Math.max(0, Math.floor((Date.now() - this._lastCustomerActivityAt) / 1000))
      : (elapsedSeconds || 0);
    this._elapsed.textContent = isChat && this._lastCustomerActivityAt ? this._formatElapsed(elapsed) : '—';
    this._progress.style.width = `${Math.min(100, (elapsed / INACTIVITY_THRESHOLDS.at(-1)) * 100)}%`;
    this._context.textContent = this._interactionId ? `${this._interactionId} · ${isChat ? 'live chat' : 'not a chat'}` : 'No selected chat interaction.';
    this._checkpoints.forEach((checkpoint) => {
      checkpoint.classList.toggle('done', isChat && elapsed >= Number(checkpoint.dataset.checkpoint));
    });
  }

  _formatElapsed(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  _setState(kind, label) {
    this._badge.className = `badge${kind ? ` ${kind}` : ''}`;
    this._badge.textContent = label;
  }

  _setStatus(message) {
    this._status.textContent = message;
    this._status.classList.toggle('error', this._badge.classList.contains('error'));
  }
}

customElements.define(WIDGET_NAME, ChatInactivityWidget);
