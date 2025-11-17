export interface ConfigValue {
  id?: number;
  m40: string;
  m20: string;
  k10: string;
  ony: string;
  dmf: string;
  dmfLocation: string;
  madnessStart: string;
  madnessBoss: string;
  madnessWeek: string;
  resetTime: string;
  startDate: string;
}
export const createEmptyConfig = (): ConfigValue => ({
  resetTime: '',
  m40: '',
  m20: '',
  k10: '',
  ony: '',
  dmf: '',
  dmfLocation: '',
  madnessStart: '',
  madnessBoss: '',
  madnessWeek: '',
  startDate: ''
});
