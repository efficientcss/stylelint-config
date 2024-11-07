
import { fileURLToPath } from 'node:url';
import stylelint from "stylelint";
import path from "path";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const config = {
	plugins: path.resolve(__dirname, "../plugins/ecss-flex-children.js"),
	rules: {
		"ecss/flex-children": true,
	},
};

describe("should pass", () => {
	it("should pass when CSS does not contain forbidden rules", async () => {
		const result = await stylelint.lint({
			files: path.resolve(__dirname, "fixtures/ecss-flex-children.pass.css"),
			config,
		});
		expect(result.errored).toBe(false);
	});
});

describe("should fail", () => {
	it("should fail when CSS contains forbidden rules", async () => {
		const result = await stylelint.lint({
			files: path.resolve(__dirname, "fixtures/ecss-flex-children.fail.css"),
			config,
		});
		expect(result.errored).toBe(true);
		expect(result.results[0].warnings).toHaveLength(3);
	});
});