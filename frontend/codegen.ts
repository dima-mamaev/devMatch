import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../api/schema.gql",
  documents: ["src/lib/graphql/operations.ts"],
  generates: {
    "./src/lib/graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        skipTypename: true,
        enumsAsTypes: true,
        withHooks: true,
        withHOC: false,
        withComponent: false,
        scalars: {
          DateTime: "string",
          JSON: "Record<string, unknown>",
          CustomUpload: "File",
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
