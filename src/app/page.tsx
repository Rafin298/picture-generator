"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from 'openai';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(
    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
  );
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    "Generate Image with your imagination."
  );
  const [typedText, setTypedText] = useState("");
  const text = "Creating image...Please Wait...";

  const stars = [];
  for (let i = 0; i < 20; i++) {
    stars.push(<div className="shooting_star" key={i}></div>);
  }
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  
  if (!apiKey) {
    throw new Error("apiKey is not defined in config file");
  }


  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setPlaceholder(`Search ${prompt}..`);
    setLoading(true);
    const res = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });
    setLoading(false);
    const data = res.data;
    setResult(data.data[0].url || "no imagine found");
  };

  useEffect(() => {
    if (loading) {
      let i = 0;
      const typing = setInterval(() => {
        setTypedText(text.slice(0, i));
        i++;
        if (i > text.length) {
          i = 0; // reset i to 0
          setTypedText(""); // reset typedText to an empty string
        }
      }, 100);
      return () => clearInterval(typing);
    }
  }, [loading]);

  const sendEmail = (url = "") => {
    url = result;
    const message = `Here's your image download link: ${url}`;
    window.location.href = `mailto:someone@example.com?subject=Image Download Link&body=${message}`;
  };
  return (
    <div className={`${styles.app_main}`}>
      <div className={styles.item}>
      <h2 className={styles.h2}>Picture Generator</h2>

      <textarea
        className={styles.app_input}
        placeholder={placeholder}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button className={styles.button} onClick={generateImage}>Generate Image</button>
      </div>
      <div className={`${styles.item} ${styles.center}`}>
      {loading ? (
        <>
          {/* <div className={styles.lds_facebook}><div></div><div></div><div></div></div> */}
          <div className={styles.loader}></div>
        </>
      ) : (
        <>
          {result.length > 0 ? (
            <img
              className={styles.result_image}
              src={result}
              alt="result"
              onClick={() => sendEmail(result)}
              style={{ cursor: "pointer" }}
              // width={512}
              // height={512}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </div>
    </div>
  );
}
