import Svg, { type SvgProps, Path } from "react-native-svg"

const DolarIcon = (props: SvgProps) => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 256 256"
    fill={"#fff"}
    {...props}
  >
    <Path d="M152 124h-20V52h12a36 36 0 0 1 36 36 4 4 0 0 0 8 0 44.05 44.05 0 0 0-44-44h-12V24a4 4 0 0 0-8 0v20h-12a44 44 0 0 0 0 88h12v72h-20a36 36 0 0 1-36-36 4 4 0 0 0-8 0 44.05 44.05 0 0 0 44 44h20v20a4 4 0 0 0 8 0v-20h20a44 44 0 0 0 0-88Zm-40 0a36 36 0 0 1 0-72h12v72Zm40 80h-20v-72h20a36 36 0 0 1 0 72Z" />
  </Svg>
)

const EuroIcon = (props: SvgProps) => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 256 256"
    fill={"#fff"}
    {...props}
  >
    <Path d="M187 195a4 4 0 0 1-.31 5.65A76 76 0 0 1 60.11 148H40a4 4 0 0 1 0-8h20v-24H40a4 4 0 0 1 0-8h20.11a76 76 0 0 1 126.56-52.65 4 4 0 1 1-5.34 6A68 68 0 0 0 68.13 108H136a4 4 0 0 1 0 8H68v24h52a4 4 0 0 1 0 8H68.13a68 68 0 0 0 113.2 46.69 4 4 0 0 1 5.67.31Z" />
  </Svg>
)

const YuanIcon = (props: SvgProps) => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 256 256"
    fill={"#fff"}
    {...props}
  >
    <Path d="M60 56a4 4 0 0 1 4-4h128a4 4 0 0 1 0 8H64a4 4 0 0 1-4-4Zm156 108a4 4 0 0 0-4 4v20h-36a20 20 0 0 1-20-20v-52h52a4 4 0 0 0 0-8H48a4 4 0 0 0 0 8h52v12a60.07 60.07 0 0 1-60 60 4 4 0 0 0 0 8 68.07 68.07 0 0 0 68-68v-12h40v52a28 28 0 0 0 28 28h40a4 4 0 0 0 4-4v-24a4 4 0 0 0-4-4Z" />
  </Svg>
)

// icons objects with the same name as the icons above
export const currencyIcons = [
  {
    name: "USD",
    icon: DolarIcon,
  },
  {
    name: "EUR",
    icon: EuroIcon,
  },
  {
    name: "CNY",
    icon: YuanIcon,
  },
] as const

export const CurrencyIcon = ({ name }: { name: typeof currencyIcons[number]["name"] }) => {
  const Icon = currencyIcons.find((icon) => icon.name === name)?.icon

  if (!Icon) {
    return null
  }

  return <Icon />
}

export { DolarIcon, EuroIcon, YuanIcon }