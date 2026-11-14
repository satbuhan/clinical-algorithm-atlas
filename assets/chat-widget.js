/* =========================================================================
   Clinical Algorithm Atlas — shared BYOK ("bring your own key") AI chat
   widget.

   WHAT THIS IS
   A small floating assistant button, bottom-right, on every tool page in
   the atlas. The visitor supplies their own API key for an AI provider;
   the key is stored only in their browser (localStorage, scoped to the
   satbuhan.github.io origin) and every request goes straight from their
   browser to the provider they picked. No backend, no accounts, nothing
   of theirs ever touches us.

   HOW A TOOL PAGE LOADS THIS
   One line near the end of <body>, after the page's own scripts:
     <script defer src="https://satbuhan.github.io/clinical-algorithm-atlas/assets/chat-widget.js"></script>
   and the matching stylesheet in <head>:
     <link rel="stylesheet" href="https://satbuhan.github.io/clinical-algorithm-atlas/assets/chat-widget.css">
   That is the entire integration. This file builds its own DOM, does not
   touch anything the host page already has, and is wrapped so that any
   failure here can never break the flowchart tool itself.

   PROMOTING A NEW PROVIDER
   Only Anthropic (Claude) is `active: true` below — it is the only one
   whose direct-browser CORS access has actually been confirmed from a
   real browser. The other four (OpenAI, Google Gemini, xAI Grok,
   DeepSeek) are wired up end-to-end (config, request building, response
   parsing) but shown disabled until each is verified live with a real
   key. Promote one by flipping its `active` flag to `true` — no other
   code change is required. Model id strings for the inactive providers
   are a best effort as of this writing and should be double-checked
   against each provider's current docs before going live.

   SAFETY NOTES (apply throughout this file)
   - Every DOM node is built with createElement/textContent. The only use
     of innerHTML is setInnerSVG(), and it is only ever given one of the
     fixed, hand-written strings in ICONS below — never anything derived
     from user input, page content, or an API response.
   - init() and every event handler run through safely()/try-catch, so a
     bug here shows up as a quietly broken widget, never a broken host
     page.
   ========================================================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'atlas-chat-config-v1';

  /* ---------------------------------------------------------------------
     Provider / family / deployment / field configuration
     --------------------------------------------------------------------- */

  var PROVIDERS = [
    {
      id: 'anthropic',
      name: 'Anthropic (Claude)',
      active: true,
      families: [
        {
          id: 'claude',
          name: 'Claude',
          deployments: [
            {
              id: 'direct',
              name: 'Direct API',
              fields: [
                { id: 'apiKey', label: 'API key', type: 'password', placeholder: 'sk-ant-...' }
              ],
              models: [
                { id: 'claude-opus-5-5', name: 'Claude Opus 5.5' },
                { id: 'claude-sonnet-5-5', name: 'Claude Sonnet 5.5' },
                { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', isDefault: true },
                { id: 'claude-haiku-5-5', name: 'Claude Haiku 5.5' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'openai',
      name: 'OpenAI',
      active: false,
      families: [
        {
          id: 'gpt',
          name: 'GPT',
          deployments: [
            {
              id: 'direct',
              name: 'Direct API',
              fields: [
                { id: 'apiKey', label: 'API key', type: 'password', placeholder: 'sk-...' }
              ],
              models: [
                { id: 'gpt-4o', name: 'GPT-4o', isDefault: true },
                { id: 'gpt-4o-mini', name: 'GPT-4o mini' },
                { id: 'gpt-4.1', name: 'GPT-4.1' }
              ]
            },
            {
              id: 'azure',
              name: 'Azure OpenAI',
              fields: [
                { id: 'apiKey', label: 'API key', type: 'password', placeholder: 'Your Azure resource key' },
                { id: 'endpoint', label: 'Azure endpoint', type: 'text', placeholder: 'https://your-resource.openai.azure.com' },
                { id: 'deploymentName', label: 'Deployment name', type: 'text', placeholder: 'e.g. gpt-4o-deployment' }
              ],
              models: []
            }
          ]
        }
      ]
    },
    {
      id: 'google',
      name: 'Google (Gemini)',
      active: false,
      families: [
        {
          id: 'gemini',
          name: 'Gemini',
          deployments: [
            {
              id: 'direct',
              name: 'Direct API',
              fields: [
                { id: 'apiKey', label: 'API key', type: 'password', placeholder: 'AIza...' }
              ],
              models: [
                { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', isDefault: true },
                { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'xai',
      name: 'xAI (Grok)',
      active: false,
      families: [
        {
          id: 'grok',
          name: 'Grok',
          deployments: [
            {
              id: 'direct',
              name: 'Direct API',
              fields: [
                { id: 'apiKey', label: 'API key', type: 'password', placeholder: 'xai-...' }
              ],
              models: [
                { id: 'grok-2-latest', name: 'Grok 2', isDefault: true }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      active: false,
      families: [
        {
          id: 'deepseek',
          name: 'DeepSeek',
          deployments: [
            {
              id: 'direct',
              name: 'Direct API',
              fields: [
                { id: 'apiKey', label: 'API key', type: 'password', placeholder: 'sk-...' }
              ],
              models: [
                { id: 'deepseek-chat', name: 'DeepSeek Chat', isDefault: true },
                { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' }
              ]
            }
          ]
        }
      ]
    }
  ];

  /* ---------------------------------------------------------------------
     Static icon strings — hard-coded, never interpolated. See the
     safety note at the top of this file for why innerHTML is safe here.
     --------------------------------------------------------------------- */

  var ICONS = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"></path></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>'
  };

  /* ---------------------------------------------------------------------
     State
     --------------------------------------------------------------------- */

  var state = {
    open: false,
    view: 'provider', // 'provider' | 'family' | 'deployment' | 'form' | 'chat'
    providerId: null,
    familyId: null,
    deploymentId: null,
    config: null,      // saved { providerId, familyId, deploymentId, model, fields }
    messages: [],       // [{ role: 'user'|'assistant'|'error', content, pending? }]
    sending: false
  };

  var els = {};

  /* ---------------------------------------------------------------------
     Small DOM helpers
     --------------------------------------------------------------------- */

  function el(tag, opts) {
    var e = document.createElement(tag);
    if (opts) {
      if (opts.className) e.className = opts.className;
      if (typeof opts.text === 'string') e.textContent = opts.text;
      if (opts.attrs) {
        for (var k in opts.attrs) {
          if (Object.prototype.hasOwnProperty.call(opts.attrs, k)) e.setAttribute(k, opts.attrs[k]);
        }
      }
    }
    return e;
  }

  function clearChildren(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function setInnerSVG(node, svg) {
    // Only ever called with one of the fixed strings in ICONS above.
    node.innerHTML = svg;
  }

  function safely(fn) {
    try { fn(); } catch (e) {
      try { console.error('[Atlas Chat]', e); } catch (e2) { /* no-op */ }
    }
  }

  function makeBackButton(fn) {
    var btn = el('button', { className: 'ac-back', attrs: { type: 'button' } });
    setInnerSVG(btn, ICONS.back);
    var label = document.createElement('span');
    label.textContent = 'Back';
    btn.appendChild(label);
    btn.addEventListener('click', function () { safely(fn); });
    return btn;
  }

  /* ---------------------------------------------------------------------
     Config lookup helpers
     --------------------------------------------------------------------- */

  function findProvider(id) {
    for (var i = 0; i < PROVIDERS.length; i++) if (PROVIDERS[i].id === id) return PROVIDERS[i];
    return null;
  }
  function findFamily(provider, id) {
    if (!provider) return null;
    for (var i = 0; i < provider.families.length; i++) if (provider.families[i].id === id) return provider.families[i];
    return null;
  }
  function findDeployment(family, id) {
    if (!family) return null;
    for (var i = 0; i < family.deployments.length; i++) if (family.deployments[i].id === id) return family.deployments[i];
    return null;
  }

  /* ---------------------------------------------------------------------
     localStorage
     --------------------------------------------------------------------- */

  function loadConfig() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.providerId) return null;
      return parsed;
    } catch (e) { return null; }
  }

  function saveConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
      return true;
    } catch (e) { return false; }
  }

  function clearConfig() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* no-op */ }
  }

  /* ---------------------------------------------------------------------
     Navigation between setup steps
     --------------------------------------------------------------------- */

  function goProviderList() {
    state.view = 'provider';
    state.providerId = null;
    state.familyId = null;
    state.deploymentId = null;
    render();
  }

  function selectProvider(providerId) {
    var provider = findProvider(providerId);
    if (!provider || !provider.active) return;
    state.providerId = providerId;
    state.familyId = null;
    state.deploymentId = null;
    if (provider.families.length === 1) {
      selectFamily(provider.families[0].id);
    } else {
      state.view = 'family';
      render();
    }
  }

  function selectFamily(familyId) {
    state.familyId = familyId;
    state.deploymentId = null;
    var provider = findProvider(state.providerId);
    var family = findFamily(provider, familyId);
    if (!family) return;
    if (family.deployments.length === 1) {
      selectDeployment(family.deployments[0].id);
    } else {
      state.view = 'deployment';
      render();
    }
  }

  function selectDeployment(deploymentId) {
    state.deploymentId = deploymentId;
    state.view = 'form';
    render();
  }

  function backFromDeployment() {
    var provider = findProvider(state.providerId);
    if (provider && provider.families.length === 1) { goProviderList(); return; }
    state.deploymentId = null;
    state.view = 'family';
    render();
  }

  function backFromForm() {
    var provider = findProvider(state.providerId);
    var family = findFamily(provider, state.familyId);
    if (!family) { goProviderList(); return; }
    if (family.deployments.length === 1) {
      if (provider.families.length === 1) { goProviderList(); } else { state.view = 'family'; state.deploymentId = null; render(); }
    } else {
      state.view = 'deployment';
      render();
    }
  }

  function reconfigure() {
    if (!state.config) { goProviderList(); return; }
    state.providerId = state.config.providerId;
    state.familyId = state.config.familyId;
    state.deploymentId = state.config.deploymentId;
    state.view = 'form';
    render();
  }

  /* ---------------------------------------------------------------------
     Rendering
     --------------------------------------------------------------------- */

  function render() {
    if (!els.body) return;
    clearChildren(els.body);
    if (state.view === 'chat' && state.config) {
      renderChatView();
      return;
    }
    if (state.view === 'family') renderFamilyList();
    else if (state.view === 'deployment') renderDeploymentList();
    else if (state.view === 'form') renderForm();
    else renderProviderList();
    updateHeader();
  }

  function updateHeader() {
    clearChildren(els.headTitle);
    clearChildren(els.headActions);

    if (state.view === 'chat' && state.config) {
      var provider = findProvider(state.config.providerId);
      var title = document.createElement('div');
      title.appendChild(document.createTextNode('Atlas Assistant'));
      var small = document.createElement('small');
      small.textContent = (provider ? provider.name : 'Unknown provider') + (state.config.model ? ' • ' + state.config.model : '');
      title.appendChild(small);
      els.headTitle.appendChild(title);

      var gearBtn = el('button', { className: 'ac-icon-btn', attrs: { type: 'button', title: 'Change settings', 'aria-label': 'Change settings' } });
      setInnerSVG(gearBtn, ICONS.gear);
      gearBtn.addEventListener('click', function () { safely(reconfigure); });
      els.headActions.appendChild(gearBtn);

      var trashBtn = el('button', { className: 'ac-icon-btn', attrs: { type: 'button', title: 'Remove saved key', 'aria-label': 'Remove saved key' } });
      setInnerSVG(trashBtn, ICONS.trash);
      trashBtn.addEventListener('click', function () {
        safely(function () {
          clearConfig();
          state.config = null;
          state.messages = [];
          state.view = 'provider';
          render();
        });
      });
      els.headActions.appendChild(trashBtn);
    } else {
      var setupTitle = document.createElement('div');
      setupTitle.textContent = 'Set up AI assistant';
      els.headTitle.appendChild(setupTitle);
    }

    var closeBtn = el('button', { className: 'ac-icon-btn', attrs: { type: 'button', title: 'Close', 'aria-label': 'Close' } });
    setInnerSVG(closeBtn, ICONS.close);
    closeBtn.addEventListener('click', function () { safely(closePanel); });
    els.headActions.appendChild(closeBtn);
  }

  function renderProviderList() {
    var wrap = el('div', { className: 'ac-step' });
    wrap.appendChild(el('p', { className: 'ac-step__eyebrow', text: 'Step 1 of 3' }));
    wrap.appendChild(el('h3', { className: 'ac-step__title', text: 'Choose a provider' }));

    var list = el('div', { className: 'ac-list' });
    PROVIDERS.forEach(function (provider) {
      var btn = el('button', { className: 'ac-option', attrs: { type: 'button' } });
      if (!provider.active) btn.disabled = true;
      btn.appendChild(el('span', { className: 'ac-option__name', text: provider.name }));
      btn.appendChild(el('span', {
        className: provider.active ? 'ac-option__badge ac-option__badge--live' : 'ac-option__badge',
        text: provider.active ? 'Available' : 'Coming soon'
      }));
      if (provider.active) {
        btn.addEventListener('click', function () { safely(function () { selectProvider(provider.id); }); });
      }
      list.appendChild(btn);
    });
    wrap.appendChild(list);

    var hint = el('p', { className: 'ac-field__hint', text: 'Only Anthropic (Claude) is enabled right now. The others are planned and will switch on once they are confirmed to work.' });
    hint.style.marginTop = '10px';
    wrap.appendChild(hint);

    els.body.appendChild(wrap);
  }

  function renderFamilyList() {
    var provider = findProvider(state.providerId);
    if (!provider) { goProviderList(); return; }
    var wrap = el('div', { className: 'ac-step' });
    wrap.appendChild(makeBackButton(goProviderList));
    wrap.appendChild(el('p', { className: 'ac-step__eyebrow', text: 'Step 2 of 3 • ' + provider.name }));
    wrap.appendChild(el('h3', { className: 'ac-step__title', text: 'Choose a model family' }));

    var list = el('div', { className: 'ac-list' });
    provider.families.forEach(function (family) {
      var btn = el('button', { className: 'ac-option', text: family.name, attrs: { type: 'button' } });
      btn.addEventListener('click', function () { safely(function () { selectFamily(family.id); }); });
      list.appendChild(btn);
    });
    wrap.appendChild(list);
    els.body.appendChild(wrap);
  }

  function renderDeploymentList() {
    var provider = findProvider(state.providerId);
    var family = findFamily(provider, state.familyId);
    if (!provider || !family) { goProviderList(); return; }
    var wrap = el('div', { className: 'ac-step' });
    wrap.appendChild(makeBackButton(backFromDeployment));
    wrap.appendChild(el('p', { className: 'ac-step__eyebrow', text: 'Step 3 of 3 • ' + provider.name + ' • ' + family.name }));
    wrap.appendChild(el('h3', { className: 'ac-step__title', text: 'Choose a deployment type' }));

    var list = el('div', { className: 'ac-list' });
    family.deployments.forEach(function (dep) {
      var btn = el('button', { className: 'ac-option', text: dep.name, attrs: { type: 'button' } });
      btn.addEventListener('click', function () { safely(function () { selectDeployment(dep.id); }); });
      list.appendChild(btn);
    });
    wrap.appendChild(list);
    els.body.appendChild(wrap);
  }

  function renderForm() {
    var provider = findProvider(state.providerId);
    var family = findFamily(provider, state.familyId);
    var deployment = findDeployment(family, state.deploymentId);
    if (!provider || !family || !deployment) { goProviderList(); return; }

    var wrap = el('div', { className: 'ac-step' });
    wrap.appendChild(makeBackButton(backFromForm));
    wrap.appendChild(el('p', { className: 'ac-step__eyebrow', text: provider.name + ' • ' + family.name }));
    wrap.appendChild(el('h3', { className: 'ac-step__title', text: deployment.name }));

    var inputs = {};
    var modelSelect = null;
    var existingFields = (state.config && state.config.providerId === provider.id) ? state.config.fields : null;

    if (deployment.models && deployment.models.length) {
      var modelField = el('div', { className: 'ac-field' });
      var modelLabel = el('label', { text: 'Model' });
      modelLabel.setAttribute('for', 'ac-field-model');
      modelField.appendChild(modelLabel);
      modelSelect = document.createElement('select');
      modelSelect.id = 'ac-field-model';
      modelSelect.style.width = '100%';
      modelSelect.style.boxSizing = 'border-box';
      modelSelect.style.padding = '8px 10px';
      modelSelect.style.border = '1px solid var(--rule-strong, #B9B4A3)';
      modelSelect.style.borderRadius = '6px';
      modelSelect.style.fontSize = '13px';
      modelSelect.style.fontFamily = 'inherit';
      modelSelect.style.background = '#fff';
      modelSelect.style.color = 'var(--ink, #1F2420)';
      deployment.models.forEach(function (m) {
        var opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.name;
        if (state.config && state.config.model === m.id) opt.selected = true;
        else if (!state.config && m.isDefault) opt.selected = true;
        modelSelect.appendChild(opt);
      });
      modelField.appendChild(modelSelect);
      wrap.appendChild(modelField);
    }

    deployment.fields.forEach(function (fdef) {
      var field = el('div', { className: 'ac-field' });
      var inputId = 'ac-field-' + fdef.id;
      var label = el('label', { text: fdef.label });
      label.setAttribute('for', inputId);
      field.appendChild(label);

      var inputWrap = el('div', { className: 'ac-field__input-wrap' });
      var input = document.createElement('input');
      input.id = inputId;
      input.type = fdef.type === 'password' ? 'password' : 'text';
      input.placeholder = fdef.placeholder || '';
      input.autocomplete = 'off';
      input.spellcheck = false;
      if (existingFields && existingFields[fdef.id]) input.value = existingFields[fdef.id];
      inputWrap.appendChild(input);

      if (fdef.type === 'password') {
        var toggle = el('button', { className: 'ac-field__toggle', attrs: { type: 'button', 'aria-label': 'Show or hide key' } });
        setInnerSVG(toggle, ICONS.eye);
        var shown = false;
        toggle.addEventListener('click', function () {
          safely(function () {
            shown = !shown;
            input.type = shown ? 'text' : 'password';
            setInnerSVG(toggle, shown ? ICONS.eyeOff : ICONS.eye);
          });
        });
        inputWrap.appendChild(toggle);
      }

      field.appendChild(inputWrap);
      wrap.appendChild(field);
      inputs[fdef.id] = input;
    });

    var notice = el('div', { className: 'ac-notice' });
    var strong = document.createElement('strong');
    strong.textContent = 'Where this is stored: ';
    notice.appendChild(strong);
    notice.appendChild(document.createTextNode(
      'Only in this browser, for this website. It is sent directly from your browser to the provider you picked above — never to any server of ours. ' +
      'Anyone who can use this browser can read it, so avoid shared or public computers. ' +
      'Note: the Android app’s in-app browser keeps its own separate storage from the regular Chrome browser on your phone, so you will need to enter your key separately in each one.'
    ));
    wrap.appendChild(notice);

    var errorSlot = el('p', { className: 'ac-field__hint' });
    errorSlot.style.color = 'var(--alarm, #8C3326)';
    errorSlot.style.display = 'none';
    wrap.appendChild(errorSlot);

    var saveBtn = el('button', {
      className: 'ac-btn',
      text: state.config ? 'Save changes' : 'Save and start chatting',
      attrs: { type: 'button' }
    });
    saveBtn.addEventListener('click', function () {
      safely(function () {
        var fields = {};
        var missing = false;
        deployment.fields.forEach(function (fdef) {
          var v = (inputs[fdef.id].value || '').trim();
          fields[fdef.id] = v;
          if (!v) missing = true;
        });
        if (missing) {
          errorSlot.textContent = 'Please fill in every field before saving.';
          errorSlot.style.display = 'block';
          return;
        }
        var cfg = {
          providerId: provider.id,
          familyId: family.id,
          deploymentId: deployment.id,
          model: modelSelect ? modelSelect.value : null,
          fields: fields
        };
        if (!saveConfig(cfg)) {
          errorSlot.textContent = 'Could not save — your browser may be blocking local storage (private browsing mode, for example).';
          errorSlot.style.display = 'block';
          return;
        }
        state.config = cfg;
        state.messages = [];
        state.view = 'chat';
        render();
      });
    });
    wrap.appendChild(saveBtn);

    if (state.config) {
      var cancelBtn = el('button', { className: 'ac-btn ac-btn--ghost', text: 'Cancel', attrs: { type: 'button' } });
      cancelBtn.style.marginTop = '8px';
      cancelBtn.addEventListener('click', function () {
        safely(function () { state.view = 'chat'; render(); });
      });
      wrap.appendChild(cancelBtn);
    }

    els.body.appendChild(wrap);
  }

  function renderChatView() {
    clearChildren(els.body);
    var chat = el('div', { className: 'ac-chat' });

    var messagesEl = el('div', { className: 'ac-messages' });
    messagesEl.appendChild(el('p', {
      className: 'ac-msg ac-msg--system',
      text: 'AI-generated answers — verify independently. This does not replace clinical judgment.'
    }));

    if (state.messages.length === 0) {
      messagesEl.appendChild(el('div', {
        className: 'ac-empty',
        text: 'Ask a question about this algorithm. Your message goes straight from your browser to the provider you set up — nothing passes through us.'
      }));
    } else {
      state.messages.forEach(function (m) {
        var cls = 'ac-msg ';
        if (m.role === 'user') cls += 'ac-msg--user';
        else if (m.role === 'error') cls += 'ac-msg--error';
        else cls += 'ac-msg--assistant';
        if (m.pending) cls += ' ac-msg--pending';
        var bubble = el('div', { className: cls });
        bubble.textContent = m.pending ? 'Thinking…' : m.content;
        messagesEl.appendChild(bubble);
      });
    }
    chat.appendChild(messagesEl);

    var composer = el('div', { className: 'ac-composer' });
    var textarea = document.createElement('textarea');
    textarea.rows = 1;
    textarea.placeholder = 'Type a question…';
    textarea.disabled = state.sending;

    var sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.disabled = state.sending;
    sendBtn.setAttribute('aria-label', 'Send');
    setInnerSVG(sendBtn, ICONS.send);

    var doSend = function () {
      safely(function () {
        var text = textarea.value;
        if (!text || !text.trim() || state.sending) return;
        textarea.value = '';
        sendMessage(text);
      });
    };

    sendBtn.addEventListener('click', doSend);
    textarea.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault();
        doSend();
      }
    });

    composer.appendChild(textarea);
    composer.appendChild(sendBtn);
    chat.appendChild(composer);

    els.body.appendChild(chat);
    updateHeader();

    try { messagesEl.scrollTop = messagesEl.scrollHeight; } catch (e) { /* no-op */ }
  }

  /* ---------------------------------------------------------------------
     Sending messages / provider request building
     --------------------------------------------------------------------- */

  function removeLastPending() {
    var idx = state.messages.length - 1;
    if (idx >= 0 && state.messages[idx].pending) state.messages.splice(idx, 1);
  }

  function extractErrorMessage(data, status) {
    try {
      if (data && data.error) {
        if (typeof data.error === 'string') return data.error;
        if (data.error.message) return data.error.message;
      }
      if (data && data.message) return data.message;
    } catch (e) { /* no-op */ }
    return 'Request failed with status ' + status + '.';
  }

  function buildRequest(cfg, history) {
    var messages = history.map(function (m) { return { role: m.role, content: m.content }; });

    if (cfg.providerId === 'anthropic') {
      return {
        url: 'https://api.anthropic.com/v1/messages',
        headers: {
          'content-type': 'application/json',
          'x-api-key': cfg.fields.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: { model: cfg.model, max_tokens: 1024, messages: messages }
      };
    }

    if (cfg.providerId === 'openai') {
      if (cfg.deploymentId === 'azure') {
        var endpoint = (cfg.fields.endpoint || '').replace(/\/+$/, '');
        return {
          url: endpoint + '/openai/deployments/' + encodeURIComponent(cfg.fields.deploymentName || '') + '/chat/completions?api-version=2024-06-01',
          headers: { 'content-type': 'application/json', 'api-key': cfg.fields.apiKey },
          body: { messages: messages }
        };
      }
      return {
        url: 'https://api.openai.com/v1/chat/completions',
        headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + cfg.fields.apiKey },
        body: { model: cfg.model, messages: messages }
      };
    }

    if (cfg.providerId === 'google') {
      return {
        url: 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(cfg.model) + ':generateContent?key=' + encodeURIComponent(cfg.fields.apiKey),
        headers: { 'content-type': 'application/json' },
        body: {
          contents: messages.map(function (m) {
            return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] };
          })
        }
      };
    }

    if (cfg.providerId === 'xai') {
      return {
        url: 'https://api.x.ai/v1/chat/completions',
        headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + cfg.fields.apiKey },
        body: { model: cfg.model, messages: messages }
      };
    }

    if (cfg.providerId === 'deepseek') {
      return {
        url: 'https://api.deepseek.com/chat/completions',
        headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + cfg.fields.apiKey },
        body: { model: cfg.model, messages: messages }
      };
    }

    throw new Error('Unknown provider: ' + cfg.providerId);
  }

  function parseResponse(cfg, data) {
    if (cfg.providerId === 'anthropic') {
      try { return data.content[0].text; } catch (e) { return ''; }
    }
    if (cfg.providerId === 'google') {
      try { return data.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join(''); } catch (e) { return ''; }
    }
    // OpenAI-compatible shape: openai, xai, deepseek
    try { return data.choices[0].message.content; } catch (e) { return ''; }
  }

  function sendMessage(text) {
    if (!state.config || state.sending) return;
    state.sending = true;
    state.messages.push({ role: 'user', content: text });
    state.messages.push({ role: 'assistant', content: '', pending: true });
    renderChatView();

    var cfg = state.config;
    var history = state.messages.filter(function (m) { return !m.pending && m.role !== 'error'; });

    try {
      var reqInfo = buildRequest(cfg, history);
      fetch(reqInfo.url, {
        method: 'POST',
        headers: reqInfo.headers,
        body: JSON.stringify(reqInfo.body)
      }).then(function (resp) {
        resp.json().catch(function () { return null; }).then(function (data) {
          safely(function () {
            removeLastPending();
            if (!resp.ok) {
              state.messages.push({ role: 'error', content: extractErrorMessage(data, resp.status) });
            } else {
              var replyText = parseResponse(cfg, data);
              state.messages.push({ role: 'assistant', content: replyText || '(Empty response from the provider.)' });
            }
            state.sending = false;
            renderChatView();
          });
        });
      }).catch(function (err) {
        safely(function () {
          removeLastPending();
          var msg = 'Could not reach the provider. This can happen if the provider blocks direct browser requests, your key is invalid, or you are offline.';
          try { if (err && err.message) msg += ' (' + err.message + ')'; } catch (e3) { /* no-op */ }
          state.messages.push({ role: 'error', content: msg });
          state.sending = false;
          renderChatView();
        });
      });
    } catch (err) {
      removeLastPending();
      state.messages.push({ role: 'error', content: 'Something went wrong preparing that request.' });
      state.sending = false;
      renderChatView();
    }
  }

  /* ---------------------------------------------------------------------
     Launcher / panel open-close
     --------------------------------------------------------------------- */

  function buildLauncher() {
    var btn = el('button', { className: 'ac-launcher', attrs: { type: 'button', 'aria-label': 'Open AI assistant', title: 'Ask the AI assistant' } });
    setInnerSVG(btn, ICONS.chat);
    btn.addEventListener('click', function () { safely(togglePanel); });
    document.body.appendChild(btn);
    els.launcher = btn;
  }

  function buildPanel() {
    var panel = el('div', { className: 'ac-panel' });
    panel.style.display = 'none';

    var head = el('div', { className: 'ac-head' });
    var headTitle = el('div', { className: 'ac-head__title' });
    var headActions = el('div', { className: 'ac-head__actions' });
    head.appendChild(headTitle);
    head.appendChild(headActions);

    var body = el('div', { className: 'ac-body' });

    panel.appendChild(head);
    panel.appendChild(body);
    document.body.appendChild(panel);

    els.panel = panel;
    els.headTitle = headTitle;
    els.headActions = headActions;
    els.body = body;
  }

  function openPanel() {
    state.open = true;
    els.panel.style.display = 'flex';
    els.launcher.classList.add('ac-launcher--open');
    setInnerSVG(els.launcher, ICONS.close);
  }

  function closePanel() {
    state.open = false;
    els.panel.style.display = 'none';
    els.launcher.classList.remove('ac-launcher--open');
    setInnerSVG(els.launcher, ICONS.chat);
  }

  function togglePanel() {
    if (state.open) closePanel(); else openPanel();
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */

  function init() {
    state.config = loadConfig();
    buildLauncher();
    buildPanel();
    state.view = state.config ? 'chat' : 'provider';
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { safely(init); });
  } else {
    safely(init);
  }
})();
