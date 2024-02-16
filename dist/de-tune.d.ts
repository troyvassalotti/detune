import { LitElement, TemplateResult } from 'lit';
import * as Tone from 'tone';
interface NoteMap {
    note: string;
    range: string;
    target: string;
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
    /** Tony synth processor for single notes. */
    synth: Tone.Synth<Tone.SynthOptions>;
    get buttons(): Element[];
    get playAllButton(): Element | null;
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