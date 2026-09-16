import { useRef, useState } from "react";
import { ArrowUp, Heart, PawPrint, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";

type Stage = "intro" | "checkin" | "gift" | "envelope" | "letter" | "final" | "done";

const teasingLines = [
  "That answer seems suspicious.",
  "Please reconsider your evidence.",
  "YES has temporarily left the conversation.",
  "A cat has reviewed the facts. The cat has concerns.",
];

function playChime(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.65);
  gain.connect(context.destination);
  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.08);
    oscillator.stop(context.currentTime + 0.7);
  });
}

function Animal({ kind, celebrate = false }: { kind: "cat" | "dog"; celebrate?: boolean }) {
  return (
    <div className={`animal animal-${kind} ${celebrate ? "animal-celebrate" : ""}`} aria-hidden="true">
      <div className="animal-tail" />
      <div className="animal-body">
        <div className="animal-head">
          <div className="animal-ear animal-ear-left" />
          <div className="animal-ear animal-ear-right" />
          <div className="animal-face">
            <i className="animal-eye" />
            <i className="animal-eye" />
            <span className="animal-nose" />
          </div>
        </div>
        <div className="animal-paws"><i /><i /></div>
      </div>
    </div>
  );
}

function Paul({ celebrating = false }: { celebrating?: boolean }) {
  return (
    <div className={`paul ${celebrating ? "paul-celebrating" : ""}`} aria-label="A tiny stylized Paul trying to look serious">
      <div className="paul-shadow" />
      <div className="paul-body">
        <div className="paul-neck" />
        <div className="paul-head">
          <div className="paul-hair"><i /><i /><i /><i /><i /></div>
          <div className="paul-brows"><i /><i /></div>
          <div className="paul-eyes"><i /><i /></div>
          <span className="paul-nose" />
          <span className="paul-mouth" />
        </div>
        <div className="paul-torso">
          <span className="chef-scarf" />
          <i className="chef-button chef-button-one" />
          <i className="chef-button chef-button-two" />
        </div>
        <div className="paul-arm paul-arm-left" />
        <div className="paul-arm paul-arm-right" />
      </div>
    </div>
  );
}

function StoryWorld({ celebrating = false }: { celebrating?: boolean }) {
  return (
    <div className="story-world" aria-hidden="true">
      <span className="float-mark mark-one">♡</span>
      <span className="float-mark mark-two">🐾</span>
      <span className="float-mark mark-three">♡</span>
      <div className="world-character world-cat"><Animal kind="cat" celebrate={celebrating} /></div>
      <Paul celebrating={celebrating} />
      <div className="world-character world-dog"><Animal kind="dog" celebrate={celebrating} /></div>
      <div className="world-floor" />
    </div>
  );
}

function RunawayButton({ label, reverse = false }: { label: "YES" | "NO"; reverse?: boolean }) {
  const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
  const [messageIndex, setMessageIndex] = useState(-1);
  const attempts = useRef(0);

  const escape = () => {
    attempts.current += 1;
    const sequence = [
      { x: 88, y: -30, rotate: 7 },
      { x: -78, y: 38, rotate: -8 },
      { x: 60, y: 42, rotate: 5 },
      { x: -48, y: -38, rotate: -5 },
    ];
    setPosition(sequence[attempts.current % sequence.length] ?? sequence[0] ?? { x: 0, y: 0, rotate: 0 });
    setMessageIndex((current) => (current + 1) % teasingLines.length);
  };

  return (
    <div className="runaway-wrap">
      <Button
        type="button"
        variant={reverse ? "soft" : "outline"}
        size="story"
        aria-label={`${label}, the playful runaway answer`}
        className="runaway-button"
        style={{ transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotate}deg)` }}
        onPointerEnter={escape}
        onPointerDown={(event) => {
          event.preventDefault();
          escape();
        }}
      >
        {label}
      </Button>
      {messageIndex >= 0 && <span className="runaway-note">{reverse ? "Even NO knows that’s not true." : teasingLines[messageIndex]}</span>}
    </div>
  );
}

function Question({
  title,
  onStable,
  runaway = "YES",
}: {
  title: string;
  onStable: () => void;
  runaway?: "YES" | "NO";
}) {
  const stable = runaway === "YES" ? "NO" : "YES";
  return (
    <div className="question-block">
      <h1>{title}</h1>
      <div className="answer-zone">
        <RunawayButton label={runaway} reverse={runaway === "NO"} />
        <Button type="button" variant="story" size="story" onClick={onStable}>{stable}</Button>
      </div>
    </div>
  );
}

function GiftBox({ opened, onOpen }: { opened: boolean; onOpen: () => void }) {
  return (
    <button className={`gift-box ${opened ? "gift-open" : ""}`} onClick={onOpen} aria-label="Open Paul’s apology box">
      <span className="box-glow" />
      <span className="box-pet">🐱</span>
      <span className="box-letter">💌</span>
      <span className="box-lid"><i className="box-bow" /></span>
      <span className="box-base"><PawPrint /><i className="box-ribbon" /></span>
      <span className="box-shadow" />
    </button>
  );
}

function Envelope({ onUnfold }: { onUnfold: () => void }) {
  return (
    <div className="envelope-wrap">
      <div className="envelope-card">
        <div className="envelope-flap" />
        <span className="envelope-paw envelope-paw-one">🐾</span>
        <span className="envelope-paw envelope-paw-two">🐾</span>
        <div className="envelope-address">
          <p><strong>To:</strong> The person who said ‘nvm paul’</p>
          <p><strong>From:</strong> The guy who’s still here anyway</p>
          <p><strong>Status:</strong> Not sealed. Never sealed.</p>
        </div>
        <span className="envelope-seal">P</span>
      </div>
      <Button type="button" variant="story" size="story" onClick={onUnfold}>UNFOLD</Button>
    </div>
  );
}

function Letter({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="letter-shell">
      <div className="letter-paper">
        <span className="letter-corner letter-cat">🐱</span>
        <span className="letter-corner letter-dog">🐶</span>
        <div className="letter-copy">
          <p>Dear you,</p>
          <p>I don't know what I did. But I know something shifted — and I'd rather trip over honesty than stand still in silence.</p>
          <p>So: I'm sorry. For the quiet, for the timing, for whatever part of this is mine.</p>
          <p>And if none of it is mine — then I'm still sorry you're carrying something alone. That part matters to me too.</p>
          <p>You don't owe me the question. You don't owe me an answer either. But whenever you're ready, I'm listening — the same way I was on day one.</p>
          <p>And one small thing: you never have to say ‘nvm’ with me. Half-formed thoughts are welcome here. Unready ones too. I'll take them exactly as they come.</p>
          <p>Take your time. I'll be right here.</p>
          <p>Still here. Still not going anywhere.</p>
          <p className="letter-signature">— 😅SERIOUS Paul 🐾</p>
        </div>
      </div>
      <div className="letter-actions">
        <Button type="button" variant="ghost" size="story" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <ArrowUp /> Read from the top
        </Button>
        <Button type="button" variant="story" size="story" onClick={onContinue}>One last question</Button>
      </div>
    </div>
  );
}

export function ApologyExperience() {
  const [stage, setStage] = useState<Stage>("intro");
  const [sound, setSound] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);

  const go = (next: Stage) => {
    playChime(sound);
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className={`apology-app stage-${stage}`}>
      <div className="ambient" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <Button
        type="button"
        variant="glass"
        size="icon"
        className="sound-toggle"
        onClick={() => setSound((value) => !value)}
        aria-label={sound ? "Turn sound off" : "Turn sound on"}
        title={sound ? "Sound off" : "Sound on"}
      >
        {sound ? <Volume2 /> : <VolumeX />}
      </Button>

      {(stage === "intro" || stage === "checkin" || stage === "final" || stage === "done") && (
        <section className="scene scene-question">
          <div className="scene-copy">
            {stage === "intro" && (
              <>
                <p className="eyebrow">Mel, before we begin...<br />I have two very important questions.</p>
                <Question title="Is Paul a serious person??" onStable={() => go("checkin")} />
              </>
            )}
            {stage === "checkin" && (
              <>
                <p className="paul-says">“Thank you.<br />At least one of us is being honest.”</p>
                <Question title="R u okay, Mel??" onStable={() => go("gift")} />
              </>
            )}
            {stage === "final" && (
              <>
                <p className="eyebrow">Paul has reviewed the emotional paperwork.</p>
                <Question title="Did you smile even once??" runaway="NO" onStable={() => go("done")} />
              </>
            )}
            {stage === "done" && (
              <div className="final-copy">
                <div className="success-mark"><Heart fill="currentColor" /></div>
                <p className="paul-says">“Excellent.<br />My work here is... emotionally unqualified, but successful.”</p>
                <h1>Maybe I couldn't fix the moment,<br />but I hope I made this one a little softer.</h1>
                <p>Thank you for staying long enough to read this, Mel.</p>
                <div className="final-signoff">— Paul<br /><span>Still serious. Still apologising.<br />Still absolutely losing arguments to runaway buttons. 🐾💙</span></div>
              </div>
            )}
          </div>
          <StoryWorld celebrating={stage === "done"} />
        </section>
      )}

      {stage === "gift" && (
        <section className="scene scene-gift">
          <div className="gift-copy">
            <p className="paul-says">“Okay.<br />You don’t have to explain everything right now.”</p>
            <h1>But I did bring something for you.</h1>
            <p>{boxOpen ? "Please handle this carefully. I spent an unreasonable amount of time being serious about it." : "Tap the box. It passed a very serious paw inspection."}</p>
            {boxOpen && <Button type="button" variant="story" size="story" onClick={() => go("envelope")}>Take the envelope</Button>}
          </div>
          <GiftBox opened={boxOpen} onOpen={() => { setBoxOpen(true); playChime(sound); }} />
        </section>
      )}

      {stage === "envelope" && (
        <section className="scene scene-envelope">
          <div className="envelope-intro"><span>For Mel, with care</span><h1>This part is actually serious.</h1></div>
          <Envelope onUnfold={() => go("letter")} />
        </section>
      )}

      {stage === "letter" && (
        <section className="scene scene-letter">
          <p className="letter-kicker"><PawPrint /> A small, unsealed letter</p>
          <Letter onContinue={() => go("final")} />
        </section>
      )}
    </main>
  );
}