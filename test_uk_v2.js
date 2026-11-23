const style = document.createElement("style");
const template = document.createElement("template");
style.textContent = `
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap");

    table {
        border: 1px solid black; /* Keep the border */
        border-radius: 10px; /* Smooth out the edges */
        padding: 5px;
        width: 100%; /* Ensure tables are of equal width */
        background-color: white; /* Ensure the background is visible */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), /* Add shadow */
                    0 6px 20px rgba(0, 0, 0, 0.1); /* Slightly larger shadow for depth */
    }

    th {
        text-align: center; /* Center the table headers */
    }

    .row {
        display: flex;
        justify-content: space-between;
    }

    .column {
        flex: 1;
        padding: 10px;
        box-sizing: border-box;
    }

    .mylabel {
        width: 281px;
        height: 50px;
        display: inline-block;
    }

    /* Base styling for tabs */
    .tablinks {
        background-color: #f1f1f1;
        border: 1px solid #ccc;
        border-bottom: none; /* No bottom border to connect with content */
        padding: 10px 20px;
        cursor: pointer;
        transition: 0.3s;
        font-family: Montserrat, Arial, sans-serif;
        font-size: 16px;
        outline: none;
        border-radius: 10px 10px 0 0; /* Rounded top corners */
        margin-right: 5px;
        position: relative;
        z-index: 1;
    }

    /* Active tab should be in front of other tabs */
    .tablinks.active {
        background-color: white;
        font-weight: bold;
        z-index: 2;
        border-color: #ccc #ccc white;
    }

    /* Adjust tab container */
    .tab-container {
        display: flex;
        justify-content: flex-start;
        border-bottom: 0px solid #ccc; /* Horizontal separator */
        margin-bottom: 0;
    }

    /* Content styling that connects to the active tab */
    .tabcontent {
        display: none;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 0 10px 10px 10px; /* Rounded corners except top-left */
        width: 100%;
        box-sizing: border-box;
        background-color: white;
        position: relative;
        top: -1px;
        z-index: 1;
    }

    /* Seamless connection between tab and content */
    .tabcontent.active {
        display: block;
        border-top: none; /* No top border for seamless connection */
    }

    .onoffswitch {
        position: relative;
        width: 60px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }

    .onoffswitch-checkbox {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    .onoffswitch-label {
        display: block;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid #044650;
        border-radius: 20px;
    }

    .onoffswitch-inner {
        display: block;
        width: 200%;
        margin-left: -100%;
        transition: margin 0.3s ease-in 0s;
    }

    .onoffswitch-inner:before {
        display: block;
        float: left;
        width: 50%;
        height: 24px;
        padding: 0;
        line-height: 24px;
        font-size: 11px;
        color: white;
        font-family: Montserrat, Trebuchet, Arial, sans-serif;
        font-weight: bold;
        box-sizing: border-box;
    }

    .onoffswitch-inner:after {
        display: block;
        float: left;
        width: 50%;
        height: 24px;
        padding: 0;
        line-height: 24px;
        font-size: 11px;
        color: black;
        font-family: Montserrat, Trebuchet, Arial, sans-serif;
        font-weight: bold;
        box-sizing: border-box;
    }

    .onoffswitch-inner:before {
        content: "ON";
        padding-left: 5px;
        background-color: #ed3636;
        color: #FFFFFF;
    }

    .onoffswitch-inner:after {
        content: "OFF";
        padding-right: 5px;
        background-color: #37de4e;
        color: #FFFFFF;
        text-align: right;
    }

    .onoffswitch-switch {
        display: block;
        width: 18px;
        margin: 6px;
        background: #FFFFFF;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 28px;
        border: 1px solid #000000;
        border-radius: 20px;
        transition: all 0.3s ease-in 0s;
    }

    .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
        margin-left: 0;
    }

    .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
        right: 0px;
    }

    /* Text to Speech Table Styling */
    textarea {
        width: 100%;
        resize: none;
        height: auto;
        box-sizing: border-box;
    }

    td {
        word-wrap: break-word;
        padding: 10px;
    }

    /* Ensure labels for text to speech messages have space */
    .tts-label {
        min-height: 3em;
    }

    /* Adjust button size and style to match on/off switch */
    button {
        font-family: Montserrat, Arial, sans-serif;
        padding: 5px 15px;
        font-size: 12px;
        height: 40px;
        border-radius: 20px;
        border: 1px solid #000000;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:disabled {
        background-color: lightgrey;
        cursor: not-allowed;
    }

    /* Styles for Text to Speech table */
    .tts-label {
        min-height: 3em; /* Ensure at least three lines of space for labels */
        word-wrap: break-word;
    }

    .tts-textarea {
        width: 100%; /* Ensure textarea takes full width */
        resize: none; /* Disable resizing */
        height: auto; /* Automatically adjust height */
        box-sizing: border-box;
    }

    .remaining-count {
        font-size: small;
    }

    .apply-button {
        font-family: Montserrat, Arial, sans-serif;
        padding: 5px 15px;
        font-size: 12px;
        height: 40px;
        border-radius: 20px;
        border: 1px solid #000000;
        background-color: lightgrey; /* Default disabled state */
        cursor: not-allowed; /* For disabled state */
        transition: background-color 0.3s ease;
    }

    .apply-button:enabled {
        background-color: lightgreen; /* Enabled state */
        cursor: pointer;
    }

    /* Status Bar Container */
    .status-bar-container {
        margin-top: 15px;
        width: 100%;
        text-align: center; /* Ensures text is horizontally centered */
    }

    /* Status Bar Styling */
    .status-bar {
        background-color: #f1f1f1;
        font-size: 14px;
        font-weight: bold;
        padding: 10px;
        color: #333;
        border: 1px solid #ccc;
        border-radius: 10px;
        display: block;
        text-align: left; /* Align text to the left */
        width: 100%; /* Ensure the bar spans the full width */
        box-sizing: border-box;
        white-space: nowrap; /* Prevent unnecessary wrapping */
        overflow: hidden; /* Prevent content overflow */
        text-overflow: ellipsis; /* Add ellipsis if text overflows */
    }

    @keyframes spin {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
    }
`;

template.innerHTML = `
    <div class="tab-container">
      <button class="tablinks" id="tabSupervisor">Supervisor Overrides</button>
      <button class="tablinks" id="tabTextToSpeech">Text to Speech Messages</button>
    </div>

    <div id="SupervisorOverrides" class="tabcontent">
      <div id="table-container-boolean"></div>
    </div>

    <div id="TextToSpeech" class="tabcontent">
      <div id="table-container-string"></div>
    </div>

    <!-- Separate Status Bar Section -->
    <div class="status-bar-container">
      <label class="status-bar" id="submitted"></label>
    </div>
`;


class SupervisorControls extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.timeoutID = undefined;
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.appendChild(style);

        // Get references to shadow DOM
        const context = this.shadowRoot;

        // Set up event listeners for the tab buttons
        const tabSupervisor = context.getElementById("tabSupervisor");
        const tabTextToSpeech = context.getElementById("tabTextToSpeech");

        tabSupervisor.addEventListener("click", (e) => openTab(e, 'SupervisorOverrides'));
        tabTextToSpeech.addEventListener("click", (e) => openTab(e, 'TextToSpeech'));

        // Default to opening the first tab
        openTab(null, 'SupervisorOverrides');

        function openTab(evt, tabName) {
            // Get all tabcontent elements and hide them
            const tabcontent = context.querySelectorAll(".tabcontent");
            tabcontent.forEach(content => content.style.display = "none");

            // Remove the active class from all tablinks
            const tablinks = context.querySelectorAll(".tablinks");
            tablinks.forEach(link => link.classList.remove("active"));

            // Show the current tab content
            const activeTab = context.getElementById(tabName);
            if (!activeTab) {
                return;
            }
            activeTab.style.display = "block";  // Make sure this matches your CSS for active tabs

            //if (activeTab) {
            //    activeTab.style.display = "block";
            //}

            // Add active class to the clicked tab (if an event is provided)
            if (evt) {
                evt.target.classList.add("active");
            } else {
                // Default active state for the first tab
                tabSupervisor.classList.add("active");
            }
        }

        context.addEventListener("click", function (e) {
            if (e.target.classList.contains('tablinks')) {
                if (e.target.id === 'tabTextToSpeech') {
                    openTab(e, 'TextToSpeech'); // Correct tab name
                } else if (e.target.id === 'tabSupervisor') {
                    openTab(e, 'SupervisorOverrides'); // Correct tab name
                }
            }
        });

        var gvid = [];
        var gvname = [];
        var description = [];
        var active = [];
        var variableType = [];
        var defaultValue = [];
        var checkboxname = [];
        var submitname = [];
        var textareaname = [];
        var remainingname = [];
        var savedtext = [];

        const tenantId = this.tenantId;
        const agentId = this.agentId;
        const apiKey = this.apiKey;
        const token = this.token;
        const gvPrefix = this.gvPrefix;
        const apiUrl = this.apiUrl;

        fetchVariables();

        async function fetchVariables() {
            var booleandata = [];
            var stringdata = [];

            getVariables(tenantId, agentId, apiKey, token, gvPrefix)
            .then(result => {
                
                for (let i = 0; i < result?.length; i++) {
                    gvid[i] = result[i].Id;
                    gvname[i] = result[i].Name; // add name to response
                    description[i] = result[i].Description;
                    active[i] = result[i].Active;
                    variableType[i] = result[i].VariableType;
                    defaultValue[i] = result[i].DefaultValue;
                    savedtext[i] = result[i].DefaultValue;
                    checkboxname[i] = "checkbox" + i;
                    submitname[i] = "submit" + i;
                    textareaname[i] = "textarea" + i;
                    remainingname[i] = "remaining" + i;

                    if (description[i] == "" ||
                        description[i] === undefined ||
                        description[i] == null) {
                        description[i] = gvname[i];
                    }

                    if (variableType[i] == "Boolean") {
                        booleandata.push({
                            name: description[i],
                            Value: defaultValue[i],
                            CheckName: checkboxname[i],
                            SubmitName: submitname[i],
                        });
                    }

                    if (variableType[i] == "String") {
                        stringdata.push({
                            name: description[i],
                            Value: defaultValue[i],
                            TextAreaName: textareaname[i],
                            SubmitName: submitname[i],
                            RemainingName: remainingname[i],
                        });

                        // var spanid = context.getElementById(remainingname[i]);
                        // var textareaid = context.getElementById(textareaname[i]);
                        // var textarealength = textareaid.value.length;
                        // spanid.innerHTML = textarealength + "/256";
                    }
                }
            })
            .then(_ => {
                const tableContainerBoolean = context.getElementById("table-container-boolean");
                tableContainerBoolean.innerHTML = generateTableBoolean(booleandata);

                const tableContainerString = context.getElementById("table-container-string");
                tableContainerString.innerHTML = generateTableString(stringdata);

                stringdata.forEach((item) => addEventListeners(item.TextAreaName));
            })
        }

        function generateTableBoolean(data) {
            let table = '<table>';
            // Removed table header (th) row
            data.forEach((item) => {
                table +=   `<tr>
                                <td>${item.name}</td>
                                <td>
                                    <div class="onoffswitch">
                                        <input type="checkbox" onclick="checkboxticked(id)" class="onoffswitch-checkbox" tabindex="0" ${item.Value === "true" ? 'checked' : ''} id="${item.CheckName}">
                                        <label class="onoffswitch-label" for="${item.CheckName}">
                                            <span class="onoffswitch-inner"></span>
                                            <span class="onoffswitch-switch"></span>
                                        </label>
                                    </div>
                                </td>
                                <td>
                                    <button onclick="submitticked(id)" class="apply-button" id="${item.SubmitName}" disabled>Apply</button>
                                </td>
                            </tr>`;
            });
            table += "</table>";
            return table;
        }

        function generateTableString(data) {
            let table = "<table>";
            // Removed table header (th) row
            data.forEach((item) => {
                table +=   `<tr>
                                <td class="tts-label">${item.name}</td>
                                <td>
                                    <textarea rows="3" class="tts-textarea" maxlength="256" id="${item.TextAreaName}">${item.Value}</textarea>
                                    <span class="remaining-count" id="${item.RemainingName}">${item.Value.length}/256</span>
                                </td>
                                <td>
                                    <button class="apply-button" id="${item.SubmitName}" disabled>Apply</button>
                                </td>
                            </tr>`;
            });
            table += "</table>";
            return table;
        }

        function addEventListeners(id) {
            var elementId = context.getElementById(id);

            elementId.addEventListener("keyup", (e) => {
                var textLength = e.target.value.length;
                e.target.nextSibling.nextSibling.innerHTML = textLength + "/256";
                StringChanged(e.target);
            });

            elementId.addEventListener("paste", (e) => {
                var textLength = e.clipboardData.getData("text/plain");
                e.target.nextSibling.nextSibling.innerHTML = textLength.length + "/256";

                StringChanged(e.target);
            });
        }

        context.addEventListener("click", (e) => {
            buttonclicked(e.target);
        });

        function buttonclicked(id) {
            // Get number
            if (id.nodeName == "INPUT") {
                checkboxticked(id);
            } else if (id.nodeName == "BUTTON") {
                submitticked(id);
            }
        }

        function checkboxticked(id) {
            // Get number
            var checkboxid = context.getElementById(id.id);

            var index = id.id.replace(/\D/g, "");
            var submitboxid = context.getElementById("submit" + index);
            submitboxid.style.backgroundColor = "lightgreen";
            submitboxid.disabled = false;

            if (checkboxid.checked == true) {
                defaultValue[index] = "true";
            } else {
                defaultValue[index] = "false";
            }

            if (defaultValue[index] == savedtext[index]) {
                submitboxid.style.backgroundColor = "lightgrey";
                submitboxid.disabled = true;
            } else {
                submitboxid.style.backgroundColor = "lightgreen";
                submitboxid.disabled = false;
            }
        }

        function StringChanged(id) {
            var index = id.id.replace(/\D/g, "");
            var submitboxid = context.getElementById("submit" + index);

            if (id.value == savedtext[index]) {
                submitboxid.style.backgroundColor = "lightgrey";
                submitboxid.disabled = true;
            } else {
                submitboxid.style.backgroundColor = "lightblue";
                submitboxid.disabled = false;
            }

            defaultValue[index] = id.value;
        }

        function submitticked(id) {
            var submitboxid = context.getElementById(id.id);
            var hasClass = submitboxid.classList.contains("apply-button");

            if (!hasClass) {
                return;
            }

            submitboxid.style.backgroundColor = "lightgrey";
            submitboxid.disabled = true;

            var index = id.id.replace(/\D/g, "");
            savedtext[index] = defaultValue[index];

            setVariable(tenantId, agentId, apiKey, token, gvid[index], defaultValue[index]);
        }

        async function getVariables(tenantId, agentId, apiKey, token, prefix) {
            const body = { tenantId, agentId, token, prefix };
            const url = createUrl();
            const request = createRequest(apiKey, body);

            return await fetch(url, request)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }

                    throw new Error("Failed to get global variables");
                })
                .catch((error) => console.log("[BCG_GLOBAL_TTS_WIDGET] - ", error));
        }

        async function setVariable(tenantId, agentId, apiKey, token, globalVariableId, defaultValue) {
            const body = { tenantId, agentId, token, globalVariableId, defaultValue, active: true };
            const url = createUrl(true);
            const request = createRequest(apiKey, body);

            return await fetch(url, request)
                .then((response) => {

                    updatelabel(response.ok);

                    if (response.ok) {
                        fetchVariables();
                    }
                    else {
                        throw new Error("Failed to update variable");
                    }
                })
                .catch((error) => console.log("[BCG_GLOBAL_TTS_WIDGET] - ", error));
        }

        function createRequest(apiKey, body) {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("X-API-KEY", apiKey);

            return {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            };
        }

        function createUrl(isSet = false) {
            let action = "get/global-variables";

            if (isSet) {
                action = "set/global-variable";
            }
            
            return apiUrl + action;
        }

        function updatelabel(isOk) {
            const submittedboxid = context.getElementById("submitted");

            // Check for errors
            if (isOk) {
                submittedboxid.textContent = "Successfully updated variable";
            } else {
                submittedboxid.textContent = "Failed to update variable";
            }
            
            // Removes update message after 5 seconds
            setTimeout(() => {
                const submittedboxid = context.getElementById("submitted");
                submittedboxid.textContent = "";
            }, 5000);
        }
    }

    printProperties() {
        console.log("[BCG_GLOBAL_TTS_WIDGET] - INFO - Properties: ")
        console.dir(this);
    }
}

customElements.define("ccbox-supervisor-controls", SupervisorControls);