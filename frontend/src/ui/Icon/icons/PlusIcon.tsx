import { SVGBasedIconProps } from "../types";

const PlusIcon: React.FC<SVGBasedIconProps> = ({ color = "var(--color-icon-light)" }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.6252 16.0417C10.6252 16.3868 10.3453 16.6667 10.0002 16.6667C9.65498 16.6667 9.37516 16.3868 9.37516 16.0417V10.625H3.9585C3.61332 10.625 3.3335 10.3452 3.3335 10C3.3335 9.65482 3.61332 9.375 3.9585 9.375H9.37516V3.95833C9.37516 3.61316 9.65498 3.33333 10.0002 3.33333C10.3453 3.33333 10.6252 3.61315 10.6252 3.95833V9.375H16.0418C16.387 9.375 16.6668 9.65482 16.6668 10C16.6668 10.3452 16.387 10.625 16.0418 10.625H10.6252V16.0417Z" fill={color} />
        </svg>

    )
}

export default PlusIcon;