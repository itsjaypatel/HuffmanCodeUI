import React, { useRef, useState } from "react";

export const HuffmanCoding = () => {
    const [encodingTab, setEncodingTab] = useState(true);
    const [error, setError] = useState();
    const [plainText, setPlainText] = useState();
    const [binaryText, setBinaryText] = useState();
    const [mapping, setMapping] = useState();
    const inputBoxRef = useRef();
    const keyMapBoxRef = useRef();

    const encodeBtnRef = useRef();
    const decodeBtnRef = useRef();

    const enableEncodingTab = () => {
        setEncodingTab(true);
        setError();
        setBinaryText();
        setPlainText();
        decodeBtnRef.current.classList.remove("active");
        encodeBtnRef.current.classList.add("active");
    }

    const enableDecodingTab = () => {
        setEncodingTab(false);
        setError();
        setBinaryText();
        setPlainText();
        encodeBtnRef.current.classList.remove("active");
        decodeBtnRef.current.classList.add("active");
    }
    const encodeDataHandler = () => {
        const text = inputBoxRef.current.value;
        if (text === undefined || text === null || text === "") {
            setError("Input is Empty!!");
            return;
        }


        fetch('http://localhost:8080/api/v1/encode', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ "text": text }) })
            .then(res => res.json()).then(res => {
                setBinaryText(res.binaryText);
                setMapping(JSON.stringify(res.keyMap));
            }).catch(error => {
                setError("Please try again later!!");
            });
    }

    const decodeDataHandler = () => {
        const binaryText = inputBoxRef.current.value;
        const keyMapping = keyMapBoxRef.current.value;

        if (binaryText === undefined || binaryText === null || binaryText === "") {
            setError("Input is Empty!!");
            return;
        }
        if (keyMapping === undefined || keyMapping === null || keyMapping === "") {
            setError("Mapping is Empty!!");
            return;
        }


        try {
            const keyMappingJsonStr = JSON.parse(keyMapping);

            console.log("key mapping json string :: ", keyMapping)
            fetch('http://localhost:8080/api/v1/decode', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ "binaryText": binaryText, "keyMap": keyMappingJsonStr }) })
                .then(res => res.json())
                .then(res => {
                    setPlainText(res.text);
                }).catch(err => {
                    setError(err);
                })
        } catch (error) {
            setError(error);
            return;
        }


    }
    return (
        <>
            <div>
                <h1 className="heading">Huffman Coding</h1>
                <button ref={encodeBtnRef} type="button" className="btn encoding-btn active" onClick={enableEncodingTab}>Encode</button>
                <button ref={decodeBtnRef} type="button" className="btn decoding-btn" onClick={enableDecodingTab}>Decode</button>
                {encodingTab && <div className="container">
                    <textarea className="input-box" placeholder="Enter Plain Text" ref={inputBoxRef}></textarea>
                    <textarea draggable="false" className="output-box" placeholder="Output Binary Text" value={binaryText} disabled></textarea>
                    <textarea draggable="false" className="key-box" placeholder="Output Mapping" value={mapping} ref={keyMapBoxRef} disabled></textarea>
                </div>}
                {!encodingTab && <div className="container">
                    <textarea className="input-box" placeholder="Enter Binary Text" ref={inputBoxRef}></textarea>
                    <textarea className="key-box" placeholder="Enter Mapping" ref={keyMapBoxRef}></textarea>
                    <textarea className="output-box" placeholder="Output Plain Text" value={plainText} disabled></textarea>
                </div>}
                <button type="button" className="btn submit-btn" onClick={() => encodingTab ? encodeDataHandler() : decodeDataHandler()}>Submit</button>
                {error && <button className="btn error-btn" onClick={() => { console.log(error) }}>{error}</button>}
            </div>
            <footer className="footer">Developed and maintained By <a href="https://www.itsjaypatel.in" target="_blank" >Jay Patel</a></footer>
            </>
    );
}