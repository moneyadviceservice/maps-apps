import { PageFactory } from '@lib/page-factory.lib';

/**
 * Here's an example where the page factory doesnt include the functionality you need
 */

const BaseAlienCheckPage = PageFactory.createQuestionPage({
  title: 'Are you an extra-terrestrial being?',
  endpoint: '/pension-wise-triage/alien-check',
  options: ['Yes', 'No'],
  accordion: {
    title: 'Why are we asking?',
    description: '⍑⏃⌰’⎍⌇ ⌇⟒⏁⊑ ⍀⏃⋏ ☊⍑⟒⌰ ⏁⊑⏃⍀.',
  },
});

/**
 * The two classes here only apply to the AlienCheckPage as we extended it.
 */
export class AlienCheckPage extends BaseAlienCheckPage {
  uploadImage() {
    // ...
  }

  proveImNotAnAlien() {
    // ...
  }
}
