

export default function Navigation() {
    var test = "test "
    return (<div>
        {test}
        <input value={test} onChange={(e) => test = e.target.value} />
        Nav

    </div>)
}