import { LitElement, html, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Synth, PolySynth, now } from "tone";
import type { Frequency } from "tone/build/esm/core/type/Units";

interface NoteMap {
	note: string;
	range: string;
	target: string;
	button: HTMLButtonElement;
}

const defaultRange = "4";
const defaultDuration = "8n";

/**
 * @element de-tune
 * @summary Pass in a set of notes to get an interactive instrument tuner.
 *
 * @attr {String} notes - Space-delineated list of notes and octave ranges.
 * @attr {String} duration - Number of quarter notes each note should ring for.
 */
@customElement("de-tune")
export class Detune extends LitElement {
	/** The number of quarter notes each note should ring for. */
	@property({
		type: String,
		converter: (value) => {
			if (value) {
				return `${value}n`;
			}
			return undefined;
		},
	})
	duration = defaultDuration;

	/** How long to wait before the next note when playing them all together. */
	@property({ type: Number })
	playAllDelay = 0.5;

	/**
	 * By default, the component replaces the button text with the letter of the note only.
	 *
	 * Set this attribute if you want the full note and range.
	 */
	@property({ type: Boolean })
	showFullNote = false;

	/** Tony synth processor for single notes. */
	@state()
	synth = new Synth().toDestination();

	get buttons() {
		return Array.from(
			this.querySelectorAll("button:not([data-play-all])"),
		) as HTMLButtonElement[];
	}

	get playAllButton() {
		return this.querySelector("button[data-play-all]") as HTMLButtonElement;
	}

	/** List of notes and their octave range. */
	get notes(): NoteMap[] {
		return this.buttons.map((button) => {
			let note = button.innerText;
			let numbers = note.match(/\d+/);
			if (numbers) {
				let range = numbers[0];
				let target = note.split(range)[0];

				return {
					note,
					range,
					target,
					button,
				};
			}

			return {
				note: `${note}${defaultRange}`,
				range: defaultRange,
				target: note,
				button,
			};
		});
	}

	/** Array of all notes. */
	private get allNotes(): string[] | undefined {
		return this.notes?.map((note) => note.note);
	}

	/**
	 * Play the selected note.
	 * @param event Click event
	 */
	private playNote = (event: Event): void => {
		const target = event.target as HTMLButtonElement;

		if (target) {
			this.synth.triggerAttackRelease(target.value, this.duration);
		}
	};

	/** Play all notes in sequence. */
	private playAll = (): void => {
		const poly = new PolySynth(Synth).toDestination();
		const time = now();
		let when = 0;
		this.notes?.forEach((note) => {
			poly.triggerAttack(note.note, time + when);
			when += this.playAllDelay;
		});
		poly.triggerRelease(this.allNotes as Frequency[], time + when + 1);
	};

	connectedCallback() {
		super.connectedCallback();

		this.notes.forEach((note) => {
			note.button.value = note.note;
			note.button.addEventListener("click", this.playNote);

			if (!this.showFullNote) {
				note.button.innerText = note.target;
			}
		});

		this.playAllButton?.addEventListener("click", this.playAll);
	}

	render(): TemplateResult {
		return html`<slot></slot>`;
	}
}
