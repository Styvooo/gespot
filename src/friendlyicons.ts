import { manifest } from 'virtual:render-svg'

// Map layers icons to show in the infobox
const friendlyIcons: { [key: string]: string } = {
  power_tower: manifest['svg']['power_tower'],
  power_pole_symbol: manifest['svg']['power_pole'],
  power_pole_point: manifest['svg']['power_pole'],
  power_pole_label: manifest['svg']['power_pole'],
  telecoms_pole_symbol: manifest['svg']['telecom_pole'],
  telecoms_pole_point: manifest['svg']['telecom_pole'],
  telecoms_pole_label: manifest['svg']['telecom_pole'],
  telecoms_mast: manifest['svg']['comms_tower']
}

export default friendlyIcons
