import { useEffect } from "react";


export default function Home(props) {
    useEffect(() => {
        props.setSearchIsVisible(false);
        props.setSelectIsVisible(false);
        props.setCol2IsVisible(false);
    }, []);

    return (
        <>
        </>
    );
}