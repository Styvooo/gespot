import { manifest } from 'virtual:render-svg'

// Map layers icons to show in the infobox
const friendlyIcons: { [key: string]: string } = {
  power_tower: manifest['svg']['power_tower'],
  power_pole: manifest['svg']['power_pole'],
  telecom_pole: manifest['svg']['telecom_pole'],
  telecom_mast: manifest['svg']['comms_tower']
}

export default friendlyIcons
