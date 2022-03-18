export default function IndexRoute() {
    return (
        <div className="index flex flex-col h-full w-full justify-center items-center">
            <h1 className="font-sans text-4xl pb-3">Input an artists name...</h1>
            <input type="text" className="rounded-md h-10 w-2/5 px-3.5 dark:text-black" />
        </div>
    )
}