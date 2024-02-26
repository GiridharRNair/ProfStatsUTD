import { Button, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";

function DrawerButton({ iconSrc, buttonText, url, boxSize }) {
    return (
        <Button
            leftIcon={<Image src={iconSrc} boxSize={boxSize} />}
            onClick={() => window.open(url, "_blank")}
            variant={"outline"}
            fontWeight={"medium"}
            width={240}
        >
            {buttonText}
        </Button>
    );
}

DrawerButton.propTypes = {
    iconSrc: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    boxSize: PropTypes.number.isRequired,
};

export default DrawerButton;
