"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { translateText, type Language } from "@/lib/translations";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (value: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const storageKey = "gioto_language";
const originalTextNodes = new WeakMap<Text, string>();
const originalAttrs = new WeakMap<Element, Map<string, string>>();
const translatableAttrs = ["placeholder", "aria-label", "title"] as const;

function shouldSkip(element: Element | null) {
  return Boolean(element?.closest("[data-no-translate],script,style,noscript"));
}

function getOriginalAttr(element: Element, attr: string) {
  let map = originalAttrs.get(element);
  if (!map) {
    map = new Map();
    originalAttrs.set(element, map);
  }

  if (!map.has(attr)) {
    map.set(attr, element.getAttribute(attr) ?? "");
  }

  return map.get(attr) ?? "";
}

function translateAttributes(root: ParentNode, language: Language) {
  const selector = translatableAttrs.map((attr) => `[${attr}]`).join(",");
  root.querySelectorAll(selector).forEach((element) => {
    if (shouldSkip(element)) return;

    translatableAttrs.forEach((attr) => {
      if (!element.hasAttribute(attr)) return;
      element.setAttribute(attr, translateText(getOriginalAttr(element, attr), language));
    });
  });
}

function translateTextNodes(root: ParentNode, language: Language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent?.trim() || shouldSkip(node.parentElement)) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  nodes.forEach((node) => {
    const original = originalTextNodes.get(node) ?? node.data;
    originalTextNodes.set(node, original);
    node.data = translateText(original, language);
  });
}

function translateDocument(language: Language) {
  document.documentElement.lang = language;

  if (!document.body) return;

  translateTextNodes(document.body, language);
  translateAttributes(document.body, language);
}

function I18nDomBridge({ language }: { language: Language }) {
  const pathname = usePathname();

  useEffect(() => {
    let timeoutId: number | undefined;

    const frameId = window.requestAnimationFrame(() => {
      translateDocument(language);

      // One delayed pass handles page content that appears immediately after
      // client hydration without keeping a MutationObserver alive.
      timeoutId = window.setTimeout(() => translateDocument(language), 120);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [language, pathname]);

  return null;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("bn");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "bn" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    function setLanguage(nextLanguage: Language) {
      setLanguageState(nextLanguage);
      window.localStorage.setItem(storageKey, nextLanguage);
    }

    return {
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === "bn" ? "en" : "bn"),
      t: (text) => translateText(text, language),
    };
  }, [language]);

  return (
    <I18nContext.Provider value={value}>
      <I18nDomBridge language={language} />
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
