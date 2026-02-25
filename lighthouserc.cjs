module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist/public",
      url: ["http://localhost/"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
