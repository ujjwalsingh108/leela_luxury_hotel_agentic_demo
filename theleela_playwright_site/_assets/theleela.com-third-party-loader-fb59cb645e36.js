/**
 * Third-party registry: vendor list from drupalSettings.leela.thirdParty (see leela.theme).
 * Main GTM is deferred until Cookiebot statistics|marketing; in GTM, keep tag-level consent
 * checks and audit Custom HTML — deferred gtm.js does not replace misconfigured tags.
 */
(function (Drupal, drupalSettings, window, document) {
  "use strict";

  console.log('[Leela] third-party-loader.js — Last Updated: 2026-06-11 14:00 IST');

  var leelaSettings = (drupalSettings && drupalSettings.leela) || {};
  var thirdPartySettings = leelaSettings.thirdParty || {};
  var cmpSettings = thirdPartySettings.cmp || {};
  var interactionSettings = thirdPartySettings.interaction || {};
  var timerSettings = thirdPartySettings.timers || {};
  var liveChatSettings = thirdPartySettings.liveChat || {};
  var thirdPartyVendors = thirdPartySettings.vendors || [];
  var blockedScriptIds = thirdPartySettings.blockedScriptIds || [];
  var hasInteracted = false;
  var cmpPromptShown = false;
  var timerElapsed = false;
  var loadedVendors = {};

  window.dataLayer = window.dataLayer || [];

  /**
   * Consent Mode signals must reach dataLayer before gtm.js. We never replace
   * an existing window.gtag (partner SDKs); consent uses this helper instead.
   */
  function leelaPushConsentToDataLayer() {
    window.dataLayer.push(Array.prototype.slice.call(arguments));
  }

  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      window.dataLayer.push(Array.prototype.slice.call(arguments));
    };
  }

  // [Netcore/Smartech] All manual smartech/netcore code disabled.
  // GTM manages the Netcore SDK injection and window.smartech entirely.
  // Do not add any smartech stubs or references here.

  function getCookiebotConsent() {
    if (!window.Cookiebot || !window.Cookiebot.consent) {
      return {};
    }

    return window.Cookiebot.consent;
  }

  function hasConsentResponse() {
    if (!window.Cookiebot) {
      return false;
    }

    if (typeof window.Cookiebot.hasResponse === "boolean") {
      return window.Cookiebot.hasResponse;
    }

    return !!(
      window.Cookiebot.consent &&
      (
        window.Cookiebot.consent.preferences ||
        window.Cookiebot.consent.statistics ||
        window.Cookiebot.consent.marketing
      )
    );
  }

  function hasRequiredConsent(requiredConsents) {
    var consentState = getCookiebotConsent();
    var required = requiredConsents || [];
    var index;

    if (!required.length) {
      return true;
    }

    for (index = 0; index < required.length; index += 1) {
      if (!consentState[required[index]]) {
        return false;
      }
    }

    return true;
  }

  function hasRequiredConsentAny(requiredConsentsAny) {
    var consentState = getCookiebotConsent();
    var keys = requiredConsentsAny || [];
    var index;

    if (!keys.length) {
      return true;
    }

    for (index = 0; index < keys.length; index += 1) {
      if (consentState[keys[index]]) {
        return true;
      }
    }

    return false;
  }

  function vendorConsentSatisfied(vendor) {
    if (!vendor) {
      return false;
    }

    if (!hasRequiredConsent(vendor.requiredConsents)) {
      return false;
    }

    if (!hasRequiredConsentAny(vendor.requiredConsentsAny)) {
      return false;
    }

    return true;
  }

  function getConsentModeState() {
    var consent = getCookiebotConsent();
    var hasStatistics = !!consent.statistics;
    var hasMarketing = !!consent.marketing;
    var hasPreferences = !!consent.preferences;

    return {
      analytics_storage: hasStatistics ? "granted" : "denied",
      ad_storage: hasMarketing ? "granted" : "denied",
      ad_user_data: hasMarketing ? "granted" : "denied",
      ad_personalization: hasMarketing ? "granted" : "denied",
      functionality_storage: hasPreferences ? "granted" : "denied",
      personalization_storage: hasPreferences ? "granted" : "denied",
      security_storage: "granted",
    };
  }

  function applyConsentModeDefaults() {
    leelaPushConsentToDataLayer("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: 500,
    });
  }

  function applyConsentModeUpdate() {
    leelaPushConsentToDataLayer("consent", "update", getConsentModeState());
  }

  function loadScriptOnce(scriptConfig) {
    var existingScript;
    var script;

    if (!scriptConfig || !scriptConfig.src || !scriptConfig.id) {
      return null;
    }

    existingScript = document.getElementById(scriptConfig.id);
    if (existingScript) {
      return existingScript;
    }

    script = document.createElement("script");
    script.type = "text/javascript";
    script.id = scriptConfig.id;
    script.src = scriptConfig.src;

    if (scriptConfig.async !== false) {
      script.async = true;
    }

    if (scriptConfig.cookieConsentMode) {
      script.setAttribute("data-cookieconsent", scriptConfig.cookieConsentMode);
    }

    if (typeof scriptConfig.onloadFn === "function") {
      script.addEventListener("load", scriptConfig.onloadFn);
      if (
        script.readyState === "complete" ||
        script.readyState === "loaded"
      ) {
        scriptConfig.onloadFn();
      }
    }
    else if (scriptConfig.onloadCode) {
      script.setAttribute("onload", scriptConfig.onloadCode);
    }

    document.body.appendChild(script);
    return script;
  }

  function removeScriptById(scriptId) {
    var script = document.getElementById(scriptId);

    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
  }

  function expireCookie(cookieName, domain, path) {
    var cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=" + (path || "/") + ";";

    if (domain) {
      cookie += " domain=" + domain + ";";
    }

    document.cookie = cookie;
  }

  function getCookieDomains() {
    var hostname = window.location.hostname || "";
    var parts = hostname.split(".");
    var domains = ["", hostname, "." + hostname];

    if (parts.length >= 2) {
      domains.push(parts.slice(-2).join("."));
      domains.push("." + parts.slice(-2).join("."));
    }

    return domains.filter(function (domain, index, collection) {
      return collection.indexOf(domain) === index;
    });
  }

  // [Netcore/Smartech DISABLED] unregisterNetcoreServiceWorker, cleanupNetcoreArtifacts,
  // and syncNetcoreConsentState are fully disabled. GTM handles all Netcore lifecycle.
  // function unregisterNetcoreServiceWorker() { ... }
  // function cleanupNetcoreArtifacts() { ... }
  // function syncNetcoreConsentState() { ... }

  /**
   * Remove the Facebook Pixel script and delete the _fbp tracking cookie
   * across all relevant domains when marketing consent is not granted.
   * Also nulls out window.fbq so it cannot queue further calls.
   *
   * GDPR / DPDPA: fbq must not persist after the user denies marketing consent.
   */
  function cleanupFbqArtifacts() {
    var cookieDomains = getCookieDomains();

    // Remove the dynamically-injected pixel script tag if present.
    removeScriptById("leela-facebook-pixel");

    // Expire the _fbp cookie on all domain variants.
    cookieDomains.forEach(function (domain) {
      expireCookie("_fbp", domain, "/");
    });

    // Replace window.fbq with a no-op so existing call sites don't throw,
    // but queued / future calls are silently discarded.
    if (typeof window.fbq !== "undefined") {
      window.fbq = function () {};
      window.fbq.queue = [];
    }

    delete loadedVendors.facebook_pixel;

    dispatchThirdPartyEvent("leela:third-party-cleaned", {
      vendorId: "facebook_pixel",
      type: "script",
    });
  }

  function syncFbqConsentState() {
    if (!hasRequiredConsent(["marketing"])) {
      cleanupFbqArtifacts();
    }
  }

  function dispatchThirdPartyEvent(name, detail) {
    window.dispatchEvent(
      new window.CustomEvent(name, {
        detail: detail || {},
      })
    );
  }

  function setCmpGateState(hidden) {
    var gateClass = cmpSettings.gateClass || "leela-cmp-gated";

    if (!document.documentElement || !gateClass) {
      return;
    }

    if (hidden) {
      document.documentElement.classList.add(gateClass);
    }
    else {
      document.documentElement.classList.remove(gateClass);
    }
  }

  function revealCmpBanner(options) {
    var bannerOptions = options || {};
    var forceShow = !!bannerOptions.forceShow;
    var source = bannerOptions.source || "first-interaction";

    if (!forceShow && (!cmpSettings.showOnFirstInteraction || hasConsentResponse())) {
      setCmpGateState(false);
      return;
    }

    if (cmpPromptShown && !forceShow) {
      return;
    }

    cmpPromptShown = true;
    setCmpGateState(false);

    if (window.Cookiebot) {
      if (forceShow && typeof window.Cookiebot.renew === "function") {
        window.Cookiebot.renew();
      }
      else if (typeof window.Cookiebot.show === "function") {
        window.Cookiebot.show();
      }
    }

    dispatchThirdPartyEvent("leela:cmp-shown", {
      source: source,
    });
  }

  function bindCookiePreferenceLinks() {
    document.addEventListener("click", function (event) {
      var preferenceLink = event.target && event.target.closest
        ? event.target.closest("a.cookieprefer")
        : null;

      if (!preferenceLink) {
        return;
      }

      event.preventDefault();
      revealCmpBanner({
        forceShow: true,
        source: "preferences-link",
      });
    }, true);
  }

  function setupDelayedVendorTimer() {
    var vendorDelayMs = parseInt(timerSettings.vendorDelayMs, 10) || 60000;
    var eventName = timerSettings.eventName || "leela:timer-60s";

    window.setTimeout(function () {
      timerElapsed = true;
      dispatchThirdPartyEvent(eventName, {
        delayMs: vendorDelayMs,
      });
      processVendors("timer_60s");
    }, vendorDelayMs);
  }

  function isBlockedGtagScript(src) {
    var match;

    if (!src || !blockedScriptIds.length) {
      return false;
    }

    match = src.match(/[?&]id=([^&]+)/);
    return !!(match && blockedScriptIds.indexOf(match[1]) !== -1);
  }

  function interceptBlockedScripts() {
    var nodeAppendChild = window.Node.prototype.appendChild;
    var nodeInsertBefore = window.Node.prototype.insertBefore;

    function isDuplicateCookiebot(src) {
      return (
        src.indexOf("consent.cookiebot.com/uc.js") !== -1 &&
        !!document.getElementById("Cookiebot")
      );
    }

    // [Netcore/Smartech DISABLED] isDuplicateNetcore removed — GTM controls script injection.
    // function isDuplicateNetcore(src) { ... }

    function shouldBlockScript(node) {
      if (
        !node ||
        node.tagName !== "SCRIPT" ||
        typeof node.src !== "string"
      ) {
        return null;
      }
      if (isBlockedGtagScript(node.src)) {
        return "blocked-gtag-id";
      }
      if (isDuplicateCookiebot(node.src)) {
        return "duplicate-cookiebot";
      }
      // [Netcore/Smartech DISABLED] isDuplicateNetcore check removed.
      return null;
    }

    window.Node.prototype.appendChild = function (node) {
      var reason = shouldBlockScript(node);
      if (reason) {
        dispatchThirdPartyEvent("leela:third-party-blocked", {
          src: node.src,
          reason: reason,
        });
        return node;
      }

      return nodeAppendChild.call(this, node);
    };

    window.Node.prototype.insertBefore = function (node, referenceNode) {
      var reason = shouldBlockScript(node);
      if (reason) {
        dispatchThirdPartyEvent("leela:third-party-blocked", {
          src: node.src,
          reason: reason,
        });
        return node;
      }

      return nodeInsertBefore.call(this, node, referenceNode);
    };
  }

  function setupInteractionGate() {
    var events = interactionSettings.events || [];
    var eventName = interactionSettings.eventName || "leela:first-interaction";

    function markInteracted() {
      var index;

      if (hasInteracted) {
        return;
      }

      hasInteracted = true;
      revealCmpBanner();
      dispatchThirdPartyEvent(eventName, {
        source: "user-interaction",
      });
      processVendors("interaction");

      for (index = 0; index < events.length; index += 1) {
        window.removeEventListener(events[index], markInteracted, true);
      }
    }

    for (var index = 0; index < events.length; index += 1) {
      window.addEventListener(events[index], markInteracted, true);
    }
  }

  function vendorCanLoad(vendor, reason) {
    if (!vendor || loadedVendors[vendor.id]) {
      return false;
    }

    if (!vendorConsentSatisfied(vendor)) {
      return false;
    }

    if (vendor.trigger === "interaction") {
      return hasInteracted || reason === "interaction";
    }

    if (vendor.trigger === "consent") {
      return hasConsentResponse() || reason === "consent";
    }

    if (vendor.trigger === "timer_60s") {
      return timerElapsed || reason === "timer_60s";
    }

    return true;
  }

  function loadGtmVendor(vendor) {
    var dataLayerName = vendor.dataLayer || "dataLayer";
    var script;
    var scriptId = "leela-" + vendor.id;

    window[dataLayerName] = window[dataLayerName] || [];
    window[dataLayerName].push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });

    script = loadScriptOnce({
      id: scriptId,
      src:
        "https://www.googletagmanager.com/gtm.js?id=" +
        vendor.containerId +
        (dataLayerName !== "dataLayer" ? "&l=" + dataLayerName : ""),
    });

    return !!script;
  }

  function loadImagePixelVendor(vendor) {
    var pixelId = "leela-" + vendor.id;
    var existingPixel = document.getElementById(pixelId);
    var pixel;

    if (existingPixel) {
      return true;
    }

    pixel = document.createElement("img");
    pixel.id = pixelId;
    pixel.alt = "";
    pixel.width = 0;
    pixel.height = 0;
    pixel.style.display = "none";
    pixel.src = vendor.baseUrl + window.location.hostname + "&sz=" + vendor.size;
    document.body.appendChild(pixel);
    return true;
  }

  function loadScriptVendor(vendor) {
    return !!loadScriptOnce({
      id: "leela-" + vendor.id,
      src: vendor.src,
      cookieConsentMode: vendor.cookieConsentMode || "statistics",
    });
  }

  function loadVendor(vendor) {
    var loaded = false;

    if (vendor.type === "gtm") {
      loaded = loadGtmVendor(vendor);
    }
    else if (vendor.type === "image-pixel") {
      loaded = loadImagePixelVendor(vendor);
    }
    else if (vendor.type === "script") {
      loaded = loadScriptVendor(vendor);
    }

    if (loaded) {
      loadedVendors[vendor.id] = true;
      dispatchThirdPartyEvent("leela:third-party-loaded", {
        vendorId: vendor.id,
        type: vendor.type,
      });
    }
  }

  function processVendors(reason) {
    var index;
    var vendor;

    for (index = 0; index < thirdPartyVendors.length; index += 1) {
      vendor = thirdPartyVendors[index];
      if (vendorCanLoad(vendor, reason)) {
        loadVendor(vendor);
      }
    }
  }

  function buildLiveChatFormDefinition() {
    return {
      wrapper: "<table></table>",
      inputs: [
        {
          id: "cx_webchat_form_firstname",
          name: "firstname",
          maxlength: "100",
          placeholder: "@i18n:webchat.ChatFormPlaceholderFirstName",
          label: "@i18n:webchat.ChatFormFirstName",
          validateWhileTyping: true,
          validate: function (event, form, input) {
            var firstnameRegEx = /^[A-Za-z\s]{2,}$/;
            return !!(input && input.val && input.val() && firstnameRegEx.test(input.val()));
          },
        },
        {
          id: "cx_webchat_form_lastname",
          name: "lastname",
          maxlength: "100",
          placeholder: "@i18n:webchat.ChatFormPlaceholderLastName",
          label: "@i18n:webchat.ChatFormLastName",
          validateWhileTyping: true,
          validate: function (event, form, input) {
            var lastnameRegEx = /^[A-Za-z\s]{2,}$/;
            return !!(input && input.val && input.val() && lastnameRegEx.test(input.val()));
          },
        },
        {
          id: "cx_webchat_form_email",
          name: "email",
          maxlength: "100",
          placeholder: "Required",
          label: "@i18n:webchat.ChatFormEmail",
          validateWhileTyping: true,
          validate: function (event, form, input) {
            var mailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return !!(input && input.val && input.val() && mailRegEx.test(input.val()));
          },
        },
        {
          id: "cx_webchat_form_phone",
          name: "phone",
          maxlength: "100",
          placeholder: "Required",
          label: "Phone",
          validate: function (event, form, input) {
            var phoneRegEx = /^\d{10,}$/;
            return !!(input && input.val && input.val() && phoneRegEx.test(input.val()));
          },
        },
      ],
    };
  }

  function configureLiveChat() {
    if (!liveChatSettings.enabled || !liveChatSettings.dataUrl) {
      return false;
    }

    if (!window._genesys) {
      window._genesys = {};
    }

    if (!window._gt) {
      window._gt = [];
    }

    window.LeelaThirdParty.liveChatForm = buildLiveChatFormDefinition();

    // Merge into existing object instead of replacing it entirely.
    // Replacing destroys the .bus property that CXBus attaches after init,
    // which breaks any subsequent openLiveChat() call on the same page.
    if (!window._genesys.widgets) {
      window._genesys.widgets = {};
    }
    window._genesys.widgets.main = {
      debug: !!liveChatSettings.debug,
      theme: liveChatSettings.theme || "dark",
      lang: liveChatSettings.language || "en",
      i18n: liveChatSettings.i18nPath,
      customStylesheetID: liveChatSettings.customStylesheetId,
    };
    window._genesys.widgets.webchat = {
      userData: {},
      emojis: true,
      cometD: {
        enabled: false,
      },
      autoInvite: {
        enabled: false,
        timeToInviteSeconds: 5,
        inviteTimeoutSeconds: 30,
      },
      chatButton: {
        enabled: true,
        openDelay: 1000,
        effectDuration: 300,
        hideDuringInvite: true,
      },
      uploadsEnabled: false,
      dataURL: liveChatSettings.dataUrl,
      apikey: "",
    };

    return true;
  }

  function isGenesysWidgetsReady() {
    var widgets = window._genesys && window._genesys.widgets;

    return !!(
      widgets &&
      widgets.bus &&
      widgets.common &&
      widgets.common.HTML
    );
  }

  function whenWebChatReady(callback, remainingAttempts) {
    var attempts = typeof remainingAttempts === "number" ? remainingAttempts : 40;

    if (isGenesysWidgetsReady()) {
      callback();
      return true;
    }

    if (attempts <= 0) {
      return false;
    }

    window.setTimeout(function () {
      whenWebChatReady(callback, attempts - 1);
    }, 250);

    return false;
  }

  function dispatchWebChatOpen() {
    if (
      !window._genesys ||
      !window._genesys.widgets ||
      !window._genesys.widgets.bus ||
      !window.LeelaThirdParty.liveChatForm
    ) {
      return false;
    }

    window._genesys.widgets.bus.command("WebChat.open", {
      formJSON: window.LeelaThirdParty.liveChatForm,
    });

    return true;
  }

  function showGenesysChatButton() {
    if (
      window._genesys &&
      window._genesys.widgets &&
      window._genesys.widgets.bus
    ) {
      window._genesys.widgets.bus.command("showChatButton");
    }
  }

  function initGenesysWidgets(onReady) {
    var pluginResult;

    if (!window.CXBus) {
      return false;
    }

    configureLiveChat();

    window.CXBus.configure({
      debug: !!liveChatSettings.debug,
      pluginsPath: liveChatSettings.pluginsPath,
    });

    pluginResult = window.CXBus.loadPlugin("widgets-core");
    if (pluginResult && typeof pluginResult.done === "function") {
      pluginResult.done(function () {
        showGenesysChatButton();
        if (typeof onReady === "function") {
          onReady();
        }
      });
    }
    else {
      showGenesysChatButton();
      if (typeof onReady === "function") {
        onReady();
      }
    }

    return true;
  }

  function removeLiveChatFab() {
    var fab = document.getElementById("leela-live-chat-fab");

    if (fab && fab.parentNode) {
      fab.parentNode.removeChild(fab);
    }
  }

  function loadLiveChat(onReady) {
    var scriptConfig;

    if (!liveChatSettings.enabled || !liveChatSettings.dataUrl) {
      return false;
    }

    if (!hasRequiredConsent(liveChatSettings.requiredConsents)) {
      return false;
    }

    if (document.getElementById(liveChatSettings.scriptId)) {
      configureLiveChat();
      if (!isGenesysWidgetsReady()) {
        initGenesysWidgets(onReady);
      }
      else if (typeof onReady === "function") {
        onReady();
      }
      return true;
    }

    configureLiveChat();

    scriptConfig = {
      id: liveChatSettings.scriptId,
      src: liveChatSettings.src,
      cookieConsentMode: liveChatSettings.cookieConsentMode,
      onloadFn: function () {
        initGenesysWidgets(onReady);
      },
    };

    return !!loadScriptOnce(scriptConfig);
  }

  function maybeLoadLiveChat() {
    if (!liveChatSettings.enabled) {
      return false;
    }

    if (!hasRequiredConsent(liveChatSettings.requiredConsents)) {
      removeLiveChatFab();
      return false;
    }

    return loadLiveChat();
  }

  function openLiveChat() {
    if (!liveChatSettings.enabled || !hasRequiredConsent(liveChatSettings.requiredConsents)) {
      return false;
    }

    configureLiveChat();

    function openWhenReady() {
      whenWebChatReady(dispatchWebChatOpen, 40);
    }

    if (!document.getElementById(liveChatSettings.scriptId)) {
      if (!loadLiveChat(openWhenReady)) {
        return false;
      }
      return true;
    }

    if (!isGenesysWidgetsReady()) {
      initGenesysWidgets(openWhenReady);
      return true;
    }

    openWhenReady();
    return true;
  }

  window.LeelaThirdParty = window.LeelaThirdParty || {};
  window.LeelaThirdParty.settings = thirdPartySettings;
  window.LeelaThirdParty.hasConsentResponse = hasConsentResponse;
  window.LeelaThirdParty.hasRequiredConsent = hasRequiredConsent;
  window.LeelaThirdParty.loadScriptOnce = loadScriptOnce;
  window.LeelaThirdParty.processVendors = processVendors;
  window.LeelaThirdParty.loadLiveChat = loadLiveChat;
  window.LeelaThirdParty.openLiveChat = openLiveChat;
  window.LeelaThirdParty.revealCmpBanner = revealCmpBanner;

  interceptBlockedScripts();
  applyConsentModeDefaults();
  applyConsentModeUpdate();
  setCmpGateState(!hasConsentResponse());
  bindCookiePreferenceLinks();
  setupInteractionGate();
  setupDelayedVendorTimer();
  // syncNetcoreConsentState(); // [Netcore/Smartech DISABLED] GTM manages Netcore.
  syncFbqConsentState();
  processVendors("initial");

  /**
   * Race-condition safety net (GDPR/DPDPA fix — partial consent sync).
   *
   * Cookiebot fires CookiebotOnConsentReady from uc.js which runs in <head>,
   * before the body-level <js-placeholder> has executed. Our CookiebotOnConsentReady
   * listener registered above would be MISSED for any session where Cookiebot
   * has already determined the consent state (returning visitors or same-page
   * "Allow Selection" flows where CookiebotOnConsentReady fires before body JS).
   *
   * Fix: At DOMContentLoaded, if Cookiebot already has a response (hasResponse===true),
   * re-run the consent-ready logic so that GTM and other vendors load correctly
   * even if the event was missed.
   */
  (function setupConsentReadyFallback() {
    function onConsentReadyFallback() {
      if (!window.Cookiebot) {
        return;
      }
      var alreadyHasResponse = typeof window.Cookiebot.hasResponse === "boolean"
        ? window.Cookiebot.hasResponse
        : hasConsentResponse();

      if (!alreadyHasResponse) {
        return;
      }

      applyConsentModeUpdate();
      setCmpGateState(false);
      // syncNetcoreConsentState(); // [Netcore/Smartech DISABLED]
      syncFbqConsentState();
      processVendors("consent");
      maybeLoadLiveChat();
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onConsentReadyFallback);
    } else {
      onConsentReadyFallback();
    }
  }());

  if (liveChatSettings.enabled) {
    window.CheckCookieConsent = function () {
      return hasRequiredConsent(liveChatSettings.requiredConsents);
    };

    window.loadLiveChat = loadLiveChat;
    window.openChatWindow = openLiveChat;

    window.addEventListener("CookiebotOnAccept", function () {
      applyConsentModeUpdate();
      setCmpGateState(false);
      // syncNetcoreConsentState(); // [Netcore/Smartech DISABLED]
      syncFbqConsentState();
      processVendors("consent");
      maybeLoadLiveChat();
    });

    window.addEventListener("CookiebotOnConsentReady", function () {
      applyConsentModeUpdate();
      setCmpGateState(!hasConsentResponse());
      // syncNetcoreConsentState(); // [Netcore/Smartech DISABLED]
      syncFbqConsentState();
      processVendors("consent");
      maybeLoadLiveChat();
    });

    window.addEventListener("CookiebotOnDecline", function () {
      applyConsentModeUpdate();
      // syncNetcoreConsentState(); // [Netcore/Smartech DISABLED]
      syncFbqConsentState();
      setCmpGateState(false);
      removeLiveChatFab();
    });
  }
  else {
    window.addEventListener("CookiebotOnAccept", function () {
      applyConsentModeUpdate();
      setCmpGateState(false);
      // syncNetcoreConsentState(); // [Netcore/Smartech DISABLED]
      syncFbqConsentState();
      processVendors("consent");
    });

    window.addEventListener("CookiebotOnConsentReady", function () {
      applyConsentModeUpdate();
      setCmpGateState(!hasConsentResponse());
      // syncNetcoreConsentState(); // [Netcore/Smartech DISABLED]
      syncFbqConsentState();
      processVendors("consent");
    });

    window.addEventListener("CookiebotOnDecline", function () {
      applyConsentModeUpdate();
      // syncNetcoreConsentState(); // [Netcore/Smartech DISABLED]
      syncFbqConsentState();
      setCmpGateState(false);
    });
  }
})(Drupal, drupalSettings, window, document);