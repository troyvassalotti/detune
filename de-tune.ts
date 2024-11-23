import { LitElement, html, TemplateResult, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { Synth, PolySynth, now, Time, SynthOptions } from "tone";
import type {
	Frequency,
	Note,
	Time as TimeType,
} from "tone/build/esm/core/type/Units";

interface NotesMap {
	note: Note;
	range: number;
	target: string;
}

/**
 * @element de-tune
 * @summary Assign a set of notes to get an interactive instrument tuner.
 */
@customElement("de-tune")
export default class Detune extends LitElement {
	static defaultRange: number = 4;

	static styles = css`
		:host {
			box-sizing: border-box;
			display: inline-block;
		}
	`;

	/** The duration of time a note should ring. */
	@property()
	public duration: TimeType = "8n";

	/** How long to wait before the next note when playing them all together. */
	@property()
	public playAllDelay: TimeType = 0.5;

	/** Hides the play all button when true. */
	@property({ type: Boolean })
	public disablePlayAll: boolean = false;

	@property({
		converter: (value: string | null): NotesMap[] | null => {
			if (typeof value !== "string") return null;

			const notes = value.split(" ") as Note[];

			return notes.map((note: Note): NotesMap => {
				let numbers = note.match(/\d+/);
				if (numbers) {
					let rangeString = numbers[0];
					let target = note.split(rangeString)[0];
					let range = Number(rangeString);

					return {
						note,
						range,
						target,
					};
				}

				return {
					note: `${note}${Detune.defaultRange}` as Note,
					range: Detune.defaultRange,
					target: note,
				};
			});
		},
	})
	public notes: NotesMap[] | null = null;

	/**
	 * By default, the component replaces the button text with the letter of the note only.
	 *
	 * Set this attribute if you want the full note and range.
	 */
	@property({ type: Boolean })
	public showFullNote: boolean = false;

	private synth: Synth<SynthOptions> = new Synth().toDestination();

	private polySynth: PolySynth<Synth<SynthOptions>> = new PolySynth(
		Synth
	).toDestination();

	/** Array of all notes. */
	private get allNotes(): Note[] | undefined {
		return this.notes?.map((note: NotesMap): Note => note.note);
	}

	/** Play the selected note. */
	private playNote({ target }: Event): void {
		if (target instanceof HTMLButtonElement) {
			this.synth.triggerAttackRelease(
				target.dataset.value as Frequency,
				this.duration
			);
		}
	}

	/** Play all notes in sequence. */
	private playAll(): void {
		if (!this.notes || !this.allNotes) return;

		const time = now();
		const playAllInSeconds = Time(this.playAllDelay).toSeconds();

		let when = 0;

		this.allNotes.forEach((note: Note): void => {
			this.polySynth.triggerAttack(note, time + when);
			when += playAllInSeconds;
		});

		this.polySynth.triggerRelease(this.allNotes, time + when + 1);
	}

	protected renderNotes(): TemplateResult {
		if (this.notes) {
			return html`
				${map(
					this.notes,
					(note: NotesMap): TemplateResult<1> => html`
						<button
							part="note"
							data-value="${note.note}"
							@click=${this.playNote}
						>
							${this.showFullNote ? note.note : note.target}
						</button>
					`
				)}
			`;
		}

		return html``;
	}

	protected render(): TemplateResult {
		return html`
			<div class="base" part="base">
				<div class="notes" part="notes">${this.renderNotes()}</div>
				${!this.disablePlayAll
					? html`
							<div class="play-all" part="play-all-container">
								<button
									part="note play-all"
									class="play-all-button"
									@click=${this.playAll}
								>
									<slot name="play-all">Play All</slot>
								</button>
							</div>
					  `
					: html``}
			</div>
		`;
	}
}
