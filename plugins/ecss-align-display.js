import stylelint from 'stylelint';
import hasPropertyValueInContext from './utils/hasPropertyValueInContext.js';
import printUrl from '../lib/printUrl.js';

const {
	createPlugin,
	utils: { report, ruleMessages }
} = stylelint;

const ruleName = 'ecss/align-display';
const messages = ruleMessages(ruleName, {
	expected: (selector) => `Expected "display: flex" or "display: grid" when using alignment or justification properties ${selector}.`,
});

const meta = {
	url: printUrl('align-display')
}


const ruleFunction = () => {
	return (postcssRoot, postcssResult) => {
		postcssRoot.walkRules((rule) => {
			const selectedNodes = rule.nodes.filter((node) => 
				node.type === 'decl' && ['align-items', 'justify-content', 'gap'].includes(node.prop)
			);

			const hasFlexOrGridDisplay = selectedNodes.length && hasPropertyValueInContext(rule, 'display', /flex|grid/, 'self');

			selectedNodes.forEach(node => {
				if (!hasFlexOrGridDisplay) {
					report({
						message: messages.expected,
						messageArgs: [rule.selector, node.prop],
						node,
						result: postcssResult,
						ruleName,
					});
				}
			});
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
