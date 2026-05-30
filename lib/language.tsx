"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translateText, type Language } from "@/lib/translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (value: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const storageKey = "gioto_language";
const originalTextNodes = new WeakMap<Text, string>();

function shouldSkipNode(node: Node) {
  const parent = node.parentElement;
  return Boolean(parent?.closest("[data-no-translate],script,style,noscript"));
}

function preserveOriginalAttribute(element: Element, attr: string) {
  const storeName = `data-original-${attr}`;
  if (!element.hasAttribute(storeName)) {
    element.setAttribute(storeName, element.getAttribute(attr) ?? "");
  }
  return element.getAttribute(storeName) ?? "";
}

function translateElementAttributes(root: ParentNode, language: Language) {
  const attrs = ["placeholder", "aria-label", "title"];
  const elements = root.querySelectorAll<HTMLElement>(
    attrs.map((attr) => `[${attr}]`).join(","),
  );

  elements.forEach((element) => {
    if (element.closest("[data-no-translate]")) return;

    attrs.forEach((attr) => {
      if (!element.hasAttribute(attr)) return;
      const original = preserveOriginalAttribute(element, attr);
      element.setAttribute(attr, translateText(original, language));
    });
  });
}

function translateTextNodes(root: ParentNode, language: Language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  nodes.forEach((node) => {
    if (shouldSkipNode(node)) return;

    const original = originalTextNodes.get(node) ?? node.data;
    originalTextNodes.set(node, original);
    node.data = translateText(original, language);
  });
}

function translateDocument(language: Language) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = language;
  translateTextNodes(document.body, language);
  translateElementAttributes(document.body, language);
}

function LanguageDomSync({ language }: { language: Language }) {
  useEffect(() => {
    translateDocument(language);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            translateTextNodes(node.parentElement, language);
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            translateTextNodes(element, language);
            translateElementAttributes(element, language);
          }
        });

        if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
          const textNode = mutation.target as Text;
          const original = originalTextNodes.get(textNode);
          const expected = original ? translateText(original, language) : null;

          if (!original || textNode.data !== expected) {
            originalTextNodes.set(textNode, textNode.data);
          }
          if (textNode.parentElement) {
            translateTextNodes(textNode.parentElement, language);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [language]);

  return null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("bn");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "bn" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
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
    <LanguageContext.Provider value={value}>
      <LanguageDomSync language={language} />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
