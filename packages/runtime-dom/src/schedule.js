const queue = new Set();
const isFlushing = false
const p = Promise.resolve()

function quequeJob(job) {
    queue.add(job)
    if (!isFlushing) {
        isFlushing = true
        p.then(() => {
            try {
                queue.forEach(job => job())
            } finally {
                isFlushing = false
                queue.clear()
            }
        })
    }
}

export {
    quequeJob,
}