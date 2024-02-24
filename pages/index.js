import { request, gql } from 'graphql-request'

export async function getServerSideProps() {
  const query = gql`
    {
      frameworks {
        id
        name
      }
    }
  `
  const data = await request('http://localhost:3000/api/graphql', query)
  const { frameworks } = data
  return {
    props: {
      frameworks,
    },
  }
}
export default function Home({ frameworks }) {
  return (
      <div className="bg-black">
        <ul>
          {frameworks.map(f => (
              <li key={f.id} className="text-xs text-sky-900">{f.name}{f.id}</li>
          ))}
        </ul>
      </div>
  )
}