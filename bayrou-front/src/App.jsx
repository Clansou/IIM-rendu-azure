import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const API_BASE = "https://bayrou-functions-clem.azurewebsites.net/api";

function App() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [vote, setVote] = useState(null);
  const [voteError, setVoteError] = useState("");
  const [votes, setVotes] = useState([]);
  const [loadingVotes, setLoadingVotes] = useState(false);

  // Authentification
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch(`${API_BASE}/createUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, email }),
      });
      if (res.status === 201) {
        setUser({ pseudo, email });
      } else {
        const text = await res.text();
        setLoginError(text);
      }
    } catch (err) {
      setLoginError("Erreur réseau");
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch(`${API_BASE}/loginUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, email }),
      });
      if (res.status === 200) {
        setUser({ pseudo, email });
      } else {
        const text = await res.text();
        setLoginError(text);
      }
    } catch (err) {
      setLoginError("Erreur réseau");
      console.error(err);
    }
  };

  // Vote
  const handleVote = async (isForBayrou) => {
    setVoteError("");
    try {
      const res = await fetch(`${API_BASE}/postVote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: pseudo, isForBayrou }),
      });
      if (res.status === 201) {
        setVote(isForBayrou);
        fetchVotes();
      } else {
        const text = await res.text();
        setVoteError(text);
      }
    } catch (err) {
      setVoteError("Erreur réseau");
      console.error(err);
    }
  };

  // Récupérer les votes
  const fetchVotes = async () => {
    setLoadingVotes(true);
    try {
      const res = await fetch(`${API_BASE}/getVotes`);
      const data = await res.json();
      setVotes(data);
    } catch {
      setVotes([]);
    }
    setLoadingVotes(false);
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  // Stats
  const total = votes.length;
  const oui = votes.filter((v) => v.isForBayrou).length;
  const non = total - oui;

  return (
    <div style={{ maxWidth: 500, margin: "auto", fontFamily: "sans-serif" }}>
      <h1>Bayrou Vote App</h1>
      {!user ? (
        <div>
          <h2>Connexion / Inscription</h2>
          <form onSubmit={handleRegister}>
            <input
              placeholder="Pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Créer un compte</button>
          </form>
          <form onSubmit={handleLogin} style={{ marginTop: 10 }}>
            <button type="submit">Se connecter</button>
          </form>
          {loginError && <div style={{ color: "red" }}>{loginError}</div>}
        </div>
      ) : (
        <div>
          <h2>Bienvenue, {user.pseudo} !</h2>
          <div>
            <b>Est-ce que François Bayrou nous manque ?</b>
            <br />
            <button onClick={() => handleVote(true)} disabled={vote !== null}>
              Oui
            </button>
            <button onClick={() => handleVote(false)} disabled={vote !== null}>
              Non
            </button>
            {voteError && <div style={{ color: "red" }}>{voteError}</div>}
            {vote !== null && (
              <div style={{ color: "green" }}>
                Merci pour votre vote&nbsp;: <b>{vote ? "Oui" : "Non"}</b>
              </div>
            )}
          </div>
        </div>
      )}

      <h2>Résultats</h2>
      {loadingVotes ? (
        <div>Chargement...</div>
      ) : (
        <div>
          <div>
            Oui : {oui} / Non : {non} / Total : {total}
          </div>
          <ul>
            {votes.map((v, i) => (
              <li key={i}>
                {v.userId} : <b>{v.isForBayrou ? "Oui" : "Non"}</b>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
