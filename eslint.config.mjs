import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig} from "eslint/config";


export default defineConfig([
    {files: ["src/*.{ts}"], plugins: {js}, extends: ["js/recommended"]},
    {files: ["src/*.{ts}"], languageOptions: {globals: {...globals.browser, ...globals.node}}},
    tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/member-ordering": ["error", {
                default: [
                    "public-static-method",
                    // Index signature
                    "signature",

                    "public-field",
                    "protected-field",
                    "private-field",
                    "#private-field",

                    "abstract-field",
                    "static-field",
                    "instance-field",

                    "field",


                    // Constructors
                    "public-constructor",
                    "protected-constructor",
                    "private-constructor",

                    // Getters
                    "public-static-get",
                    "protected-static-get",
                    "private-static-get",
                    "#private-static-get",

                    "public-decorated-get",
                    "protected-decorated-get",
                    "private-decorated-get",

                    "public-instance-get",
                    "protected-instance-get",
                    "private-instance-get",
                    "#private-instance-get",

                    "public-abstract-get",
                    "protected-abstract-get",

                    "public-get",
                    "protected-get",
                    "private-get",
                    "#private-get",

                    "static-get",
                    "instance-get",
                    "abstract-get",

                    "decorated-get",

                    "get",

                    // Setters
                    "public-static-set",
                    "protected-static-set",
                    "private-static-set",
                    "#private-static-set",

                    "public-decorated-set",
                    "protected-decorated-set",
                    "private-decorated-set",

                    "public-instance-set",
                    "protected-instance-set",
                    "private-instance-set",
                    "#private-instance-set",

                    "public-abstract-set",
                    "protected-abstract-set",

                    "public-set",
                    "protected-set",
                    "private-set",

                    "static-set",
                    "instance-set",
                    "abstract-set",

                    "decorated-set",

                    "set",

                    // Methods
                    "protected-static-method",
                    "private-static-method",
                    "#private-static-method",
                    "public-decorated-method",
                    "protected-decorated-method",
                    "private-decorated-method",
                    "public-instance-method",
                    "protected-instance-method",
                    "private-instance-method",
                    "#private-instance-method",
                    "public-abstract-method",
                    "protected-abstract-method"
                ]
            }]
        }
    }
]);
