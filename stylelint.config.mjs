export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "at-rule-no-unknown": [true, { ignoreAtRules: ["theme"] }],
    // Voreal deliberately uses BEM names and traditional media-query syntax;
    // both are part of its collision resistance and progressive compatibility.
    "selector-class-pattern": null,
    "media-feature-range-notation": null,
    // Tailwind v4 imports require string notation plus layer/source modifiers.
    "import-notation": null,
    // These formatting preferences conflict with grouped design-token sections.
    "custom-property-empty-line-before": null,
    "declaration-block-single-line-max-declarations": null,
    "declaration-empty-line-before": null,
    "value-keyword-case": null,
    // Compatibility declarations and state grouping are intentional.
    "declaration-property-value-keyword-no-deprecated": null,
    "no-descending-specificity": null,
    "property-no-deprecated": null,
    "property-no-vendor-prefix": null,
  },
};
