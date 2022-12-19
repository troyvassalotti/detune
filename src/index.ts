import { LitElement, html, TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import * as Tone from 'tone'
import type { Frequency } from 'tone/build/esm/core/type/Units'

type NoteMap = Record<string, string>

const defaultRange = '4'
const defaultDuration = '8n'

/**
 * @element de-tune
 * @summary Pass in a set of notes to get an interactive instrument tuner.
 *
 * @attr {String} notes - Space-delineated list of notes and octave ranges.
 * @attr {String} duration - Number of quarter notes each note should ring for.
 */
@customElement('de-tune')
export class Detune extends LitElement {
	/** List of notes and their octave range. */
	@property({
		type: String,
		converter: (value) => {
			if (value) {
				const splits = value.split(' ')
				return splits.map((note) => {
					const numbers = note.match(/\d+/)
					if (numbers) {
						const range = numbers[0]
						const target = note.split(range)[0]
						return {
							note,
							range,
							target,
						}
					}
					return {
						note: `${note}${defaultRange}`,
						range: defaultRange,
						target: note,
					}
				})
			}
			return undefined
		},
	})
	notes: NoteMap[] | undefined

	/** The number of quarter notes each note should ring for. */
	@property({
		type: String,
		reflect: true,
		converter: (value) => {
			if (value) {
				return `${value}n`
			}
			return undefined
		},
	})
	duration = defaultDuration

	/** Tony synth processor for single notes. */
	@state()
	synth = new Tone.Synth().toDestination()

	/** Array of all notes. */
	private get allNotes(): string[] | undefined {
		return this.notes?.map((note) => note.note)
	}

	/**
	 * Play the selected note.
	 * @param event Click event
	 */
	private playNote(event: Event): void {
		const target = event.target as HTMLButtonElement

		if (target) {
			this.synth.triggerAttackRelease(target.value, this.duration)
		}
	}

	/** Play all notes in sequence. */
	private playAll(): void {
		const poly = new Tone.PolySynth(Tone.Synth).toDestination()
		const time = Tone.now()
		let when = 0
		this.notes?.forEach((note) => {
			poly.triggerAttack(note.note, time + when)
			when += 0.5
		})
		poly.triggerRelease(this.allNotes as Frequency[], time + when + 1)
	}

	/** Render as children instead of in a shadow root. */
	protected createRenderRoot(): Element | ShadowRoot {
		return this
	}

	render(): TemplateResult {
		return html`<div class="detune__notes">
				${map(
					this.notes,
					(note) =>
						html`<button
							class="detune__note"
							value=${note.note}
							@click=${this.playNote}
						>
							${note.target}
						</button>`
				)}
			</div>
			<button class="detune__playAll" @click=${this.playAll}>Play All</button>`
	}
}
