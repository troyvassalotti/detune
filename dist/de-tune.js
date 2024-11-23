var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { Synth, PolySynth, now, Time } from "tone";
/**
 * @element de-tune
 * @summary Assign a set of notes to get an interactive instrument tuner.
 */
let Detune = class Detune extends LitElement {
    constructor() {
        super(...arguments);
        /** The duration of time a note should ring. */
        this.duration = "8n";
        /** How long to wait before the next note when playing them all together. */
        this.playAllDelay = 0.5;
        /** Hides the play all button when true. */
        this.disablePlayAll = false;
        this.notes = null;
        /**
         * By default, the component replaces the button text with the letter of the note only.
         *
         * Set this attribute if you want the full note and range.
         */
        this.showFullNote = false;
        this.synth = new Synth().toDestination();
        this.polySynth = new PolySynth(Synth).toDestination();
    }
    /** Array of all notes. */
    get allNotes() {
        return this.notes?.map((note) => note.note);
    }
    /** Play the selected note. */
    playNote({ target }) {
        if (target instanceof HTMLButtonElement) {
            this.synth.triggerAttackRelease(target.dataset.value, this.duration);
        }
    }
    /** Play all notes in sequence. */
    playAll() {
        if (!this.notes || !this.allNotes)
            return;
        const time = now();
        const playAllInSeconds = Time(this.playAllDelay).toSeconds();
        let when = 0;
        this.allNotes.forEach((note) => {
            this.polySynth.triggerAttack(note, time + when);
            when += playAllInSeconds;
        });
        this.polySynth.triggerRelease(this.allNotes, time + when + 1);
    }
    renderNotes() {
        if (this.notes) {
            return html `
				${map(this.notes, (note) => html `
						<button
							part="note"
							data-value="${note.note}"
							@click=${this.playNote}
						>
							${this.showFullNote ? note.note : note.target}
						</button>
					`)}
			`;
        }
        return html ``;
    }
    render() {
        return html `
			<div class="base" part="base">
				<div class="notes" part="notes">${this.renderNotes()}</div>
				${!this.disablePlayAll
            ? html `
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
            : html ``}
			</div>
		`;
    }
};
Detune.defaultRange = 4;
Detune.styles = css `
		:host {
			box-sizing: border-box;
			display: inline-block;
		}
	`;
__decorate([
    property()
], Detune.prototype, "duration", void 0);
__decorate([
    property()
], Detune.prototype, "playAllDelay", void 0);
__decorate([
    property({ type: Boolean })
], Detune.prototype, "disablePlayAll", void 0);
__decorate([
    property({
        converter: (value) => {
            if (typeof value !== "string")
                return null;
            const notes = value.split(" ");
            return notes.map((note) => {
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
                    note: `${note}${Detune.defaultRange}`,
                    range: Detune.defaultRange,
                    target: note,
                };
            });
        },
    })
], Detune.prototype, "notes", void 0);
__decorate([
    property({ type: Boolean })
], Detune.prototype, "showFullNote", void 0);
Detune = __decorate([
    customElement("de-tune")
], Detune);
export default Detune;
//# sourceMappingURL=de-tune.js.map