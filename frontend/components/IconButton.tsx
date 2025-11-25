import Image, { StaticImageData } from "next/image";

interface IconButtonProps {
  icon: StaticImageData;
  alt: string;
  onClick: () => void;
}

const IconButton = ({ icon, alt, onClick }: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
    >
      <Image src={icon} alt={alt} className="w-3 h-3" />
    </button>
  );
};

export default IconButton;
