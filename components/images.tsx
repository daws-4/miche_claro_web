import NextImage from 'next/image'

export function LogoImage(props: {width?: number; height?: number}) {
  return (
    <NextImage
      {...props}
      className="rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
      src={"/logo/logo_micheclaro.png"}
      alt={"LogoImage"}
      width={props.width || 40}
      height={props.height || 40}
    />
  );
}