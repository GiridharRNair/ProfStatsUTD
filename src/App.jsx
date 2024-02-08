import { useState } from "react";
import { HStack, IconButton, useColorMode, Button } from "@chakra-ui/react";
import { FiMoon } from "react-icons/fi";
import { SunIcon } from "@chakra-ui/icons";
import LookupForm from "./components/LookupForm";
import InfoIcon from "./components/InfoIcon";
import RateUsModal from "./components/RateUsModal.jsx";

function App() {
    const [compareFormOpen, setCompareFormOpen] = useState(JSON.parse(localStorage.getItem("compareFormOpen")));
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <RateUsModal />
            <InfoIcon />
            <Button
                onClick={() => {
                    setCompareFormOpen(!compareFormOpen);
                    localStorage.setItem("compareFormOpen", !compareFormOpen);
                }}
                position="fixed"
                top="1"
                left="50%"
                transform="translateX(-50%)"
                height={8}
                fontSize={"sm"}
                fontWeight={"medium"}
            >
                {compareFormOpen ? "Revert" : "Compare"}
            </Button>
            <IconButton icon={colorMode === "dark" ? <SunIcon /> : <FiMoon />} size={"sm"} position="fixed" top="1" right="1" onClick={toggleColorMode} />

            <HStack spacing={12} align="flex-start">
                {compareFormOpen && <LookupForm isCompareForm={compareFormOpen} />}
                <LookupForm />
            </HStack>
        </>
    );
}

export default App;
