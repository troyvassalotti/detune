import { LitElement, TemplateResult } from "lit";
import { Synth } from "tone";
interface NoteMap {
    note: string;
    range: string;
    target: string;
    button: HTMLButtonElement;
}
/**
 * @element de-tune
 * @summary Pass in a set of notes to get an interactive instrument tuner.
 *
 * @attr {String} notes - Space-delineated list of notes and octave ranges.
 * @attr {String} duration - Number of quarter notes each note should ring for.
 */
export declare class Detune extends LitElement {
    /** The number of quarter notes each note should ring for. */
    duration: string;
    /** How long to wait before the next note when playing them all together. */
    playAllDelay: number;
    /**
     * By default, the component replaces the button text with the letter of the note only.
     *
     * Set this attribute if you want the full note and range.
     */
    showFullNote: boolean;
    /** Tony synth processor for single notes. */
    synth: Synth<import("tone").SynthOptions>;
    get buttons(): HTMLButtonElement[];
    get playAllButton(): HTMLButtonElement;
    /** List of notes and their octave range. */
    get notes(): NoteMap[];
    /** Array of all notes. */
    private get allNotes();
    /**
     * Play the selected note.
     * @param event Click event
     */
    private playNote;
    /** Play all notes in sequence. */
    private playAll;
    connectedCallback(): void;
    render(): TemplateResult;
}
export {};
//# sourceMappingURL=de-tune.d.ts.map