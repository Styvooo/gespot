import { t } from 'i18next'

// Map layer names to a descriptive string to show in the infobox
export default function friendlyNames(): { [key: string]: string } {
  return {
    power_tower: t('names.power.tower','Pylône'),
    power_pole: t('names.power.pole','Poteau électrique'),
    power_pole_symbol: t('names.power.pole','Poteau électrique'),
    power_pole_point: t('names.power.pole','Poteau électrique'),
    power_pole_label: t('names.power.pole','Poteau électrique'),
    power_substation: t('names.power.substation','Poste électrique'),
    power_substation_point: t('names.power.substation','Poste électrique'),
    power_line: t('names.power.line', 'Ligne électrique'),
    power_line_label: t('names.power.line', 'Ligne électrique'),
    power_line_warning: t('names.power.line-warning', 'Danger électrique'),
    telecoms_line: t('names.telecoms.line', 'Artère télécoms'),
    telecoms_line_label: t('names.telecoms.line', 'Artère télécoms'),
    telecoms_mast: t('names.telecoms.mast', 'Pylône télécom'),
    telecoms_pole_symbol: t('names.telecoms.pole', 'Poteau télécom'),
    telecoms_pole_point: t('names.telecoms.pole', 'Poteau télécom'),
    telecoms_pole_label: t('names.telecoms.pole', 'Poteau télécom'),
    vegetation_forest: t('names.vegetation.forest', 'Végétation')
  }
}
