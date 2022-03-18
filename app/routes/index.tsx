import { ChangeEvent } from "react"


var changeOptions = (e: ChangeEvent<HTMLInputElement>) => {
    let sanitized = e.target.value.trim()
    // if sanitized is blank
    if (sanitized === "") {
        return; // do nothing. don't send an empty request to the server.
    }
    // TODO: Autofill for sanitized
}


export default function IndexRoute() {
    return (
        <div className="index flex flex-col h-full w-full justify-center items-center">
            <h1 className="font-sans text-4xl pb-3">Input an artists name...</h1>
            <form method="get" action="/artist" className="flex">
                <input
                    type="text"
                    name="query"
                    className="rounded-md h-10 w-2/5 px-3.5 shadow-lg outline outline-2 outline-sky-400 dark:text-black"
                    onInput={e => changeOptions(e)}
                    onSubmit={e => e.preventDefault()}
                    />
            </form>
        </div>
    )
}