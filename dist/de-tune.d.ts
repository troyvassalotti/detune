import { LitElement, TemplateResult } from "lit";
import type { Note, Time as TimeType } from "tone/build/esm/core/type/Units";
interface NotesMap {
    note: Note;
    range: number;
    target: string;
}
/**
 * @element de-tune
 * @summary Assign a set of notes to get an interactive instrument tuner.
 */
export default class Detune extends LitElement {
    static defaultRange: number;
    static styles: import("lit").CSSResult;
    /** The duration of time a note should ring. */
    duration: TimeType;
    /** How long to wait before the next note when playing them all together. */
    playAllDelay: TimeType;
    /** Hides the play all button when true. */
    disablePlayAll: boolean;
    notes: NotesMap[] | null;
    /**
     * By default, the component replaces the button text with the letter of the note only.
     *
     * Set this attribute if you want the full note and range.
     */
    showFullNote: boolean;
    private synth;
    private polySynth;
    /** Array of all notes. */
    private get allNotes();
    /** Play the selected note. */
    private playNote;
    /** Play all notes in sequence. */
    private playAll;
    protected renderNotes(): TemplateResult;
    protected render(): TemplateResult;
}
export {};
//# sourceMappingURL=de-tune.d.ts.map