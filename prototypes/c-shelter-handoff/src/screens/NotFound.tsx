import { Button, Page } from '../components/ui'
import { navigate } from '../lib/router'

// Shown when a link points to an adopter this browser does not have. With no
// backend, links only work in the browser where the check was taken.
export function NotFound() {
  return (
    <Page>
      <h1 className="text-3xl font-extrabold">We can't find that adopter.</h1>
      <p className="mt-2 text-lg">
        This prototype keeps everything in one browser, so links only open where the check was
        taken.
      </p>
      <div className="mt-6">
        <Button onClick={() => navigate('/counselor')}>Go to upcoming visits</Button>
      </div>
    </Page>
  )
}
