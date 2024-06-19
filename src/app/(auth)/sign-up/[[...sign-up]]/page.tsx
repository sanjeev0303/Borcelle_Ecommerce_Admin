import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <SignUp />
        </div>
        </>
      )
}