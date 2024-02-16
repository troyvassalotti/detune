var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import * as Tone from 'tone';
const defaultRange = '4';
const defaultDuration = '8n';
/**
 * @element de-tune
 * @summary Pass in a set of notes to get an interactive instrument tuner.
 *
 * @attr {String} notes - Space-delineated list of notes and octave ranges.
 * @attr {String} duration - Number of quarter notes each note should ring for.
 */
let Detune = class Detune extends LitElement {
    constructor() {
        super(...arguments);
        /** The number of quarter notes each note should ring for. */
        this.duration = defaultDuration;
        /** Tony synth processor for single notes. */
        this.synth = new Tone.Synth().toDestination();
    }
    get buttons() {
        return Array.from(this.querySelectorAll('button:not([data-play-all])'));
    }
    get playAllButton() {
        return this.querySelector('[data-play-all]');
    }
    /** List of notes and their octave range. */
    get notes() {
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
    get allNotes() {
        return this.notes?.map((note) => note.note);
    }
    /**
     * Play the selected note.
     * @param event Click event
     */
    playNote(event) {
        const target = event.target;
        if (target) {
            this.synth.triggerAttackRelease(target.value, this.duration);
        }
    }
    /** Play all notes in sequence. */
    playAll() {
        const poly = new Tone.PolySynth(Tone.Synth).toDestination();
        const time = Tone.now();
        let when = 0;
        this.notes?.forEach((note) => {
            poly.triggerAttack(note.note, time + when);
            when += 0.5;
        });
        poly.triggerRelease(this.allNotes, time + when + 1);
    }
    connectedCallback() {
        super.connectedCallback();
        console.log(this.notes);
        // todo iterate over each note and add button values and event listeners
    }
    render() {
        return html `<slot></slot>`;
        return html `<div class="detune__notes">
				${map(this.notes, (note) => html `<button
							class="detune__note"
							value=${note.note}
							@click=${this.playNote}
						>
							${note.target}
						</button>`)}
			</div>
			<button class="detune__playAll" @click=${this.playAll}>Play All</button>`;
    }
};
__decorate([
    property({
        type: String,
        converter: (value) => {
            if (value) {
                return `${value}n`;
            }
            return undefined;
        },
    })
], Detune.prototype, "duration", void 0);
__decorate([
    state()
], Detune.prototype, "synth", void 0);
Detune = __decorate([
    customElement('de-tune')
], Detune);
export { Detune };
//# sourceMappingURL=de-tune.js.map