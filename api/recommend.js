// api/recommend.js
const axios = require("axios");

const TOP = ["라벤더", "레몬", "자몽", "로즈마리", "페퍼민트"];
const MIDDLE = ["라일락", "피오니", "자스민", "클린코튼", "일랑일랑"];
const BASE = ["샌달우드", "시더우드", "바닐라", "화이트머스크", "블랙머스크"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = async (req, res) => {
  const { song } = req.body;
  if (!song) return res.status(400).json({ error: "노래를 입력해주세요." });

  try {
    const tokenRes = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
      headers: {
        "Authorization": "Basic " + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const token = tokenRes.data.access_token;
    const searchRes = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(song)}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const track = searchRes.data.tracks.items[0];
    const artist = track?.artists?.[0]?.name || "";
    const genrePrompt = `노래 제목 "${track.name}"과 가수 "${artist}"에 어울리는 감정을 분석해서 다음 중 각각 1개의 향을 추천해줘.

Top 노트: ${TOP.join(", ")}
Middle 노트: ${MIDDLE.join(", ")}
Base 노트: ${BASE.join(", ")}

결과는 반드시 JSON 형태로 주고, 예시는:
{ "top": "레몬", "middle": "자스민", "base": "바닐라" }
`;

    const gptRes = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: genrePrompt }]
    }, {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    const result = JSON.parse(gptRes.data.choices[0].message.content);
    res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      top: getRandom(TOP),
      middle: getRandom(MIDDLE),
      base: getRandom(BASE)
    });
  }
};
