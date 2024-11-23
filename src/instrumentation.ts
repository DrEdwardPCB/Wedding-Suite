import connect from '@/lib/mongo/db'

export async function register() {
    await connect()
}