import { LitElement, TemplateResult } from 'lit';
import * as Tone from 'tone';
type NoteMap = Record<string, string>;
/**
 * @element de-tune
 * @summary Pass in a set of notes to get an interactive instrument tuner.
 *
 * @attr {String} notes - Space-delineated list of notes and octave ranges.
 * @attr {String} duration - Number of quarter notes each note should ring for.
 */
export declare class Detune extends LitElement {
    /** List of notes and their octave range. */
    notes: NoteMap[] | undefined;
    /** The number of quarter notes each note should ring for. */
    duration: string;
    /** Tony synth processor for single notes. */
    synth: Tone.Synth<Tone.SynthOptions>;
    /** Array of all notes. */
    private get allNotes();
    /**
     * Play the selected note.
     * @param event Click event
     */
    private playNote;
    /** Play all notes in sequence. */
    private playAll;
    /** Render as children instead of in a shadow root. */
    protected createRenderRoot(): Element | ShadowRoot;
    render(): TemplateResult;
}
export {};
