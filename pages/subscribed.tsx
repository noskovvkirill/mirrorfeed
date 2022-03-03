import Layout from '@/components/Layout'
import Header from '@/components/Layout/Headers/Feed'
import { Spinner as Loader, Box } from 'design-system'
import GridPage from '@/components/Layout/GridPage'

//global state
import useSWRInfinite from 'swr/infinite'

//utils
//global state
import { useRouter } from 'next/router'
//utils
import { supabase } from 'src/client'
//type
import type { EntryType } from 'types'
import type { Middleware, SWRHook } from 'swr'
//home page
import { withSessionSsr } from "src/withSession";
import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async function getProps({ req }) {
        const siwe = req.session.siwe;
        if (!siwe?.address) {
            return {
                redirect: {
                    destination: `/`,
                    permanent: false,
                },
            };
        }
        return {
            props: {}
        }
    })

// @ts-ignore
const getUserSubscribtionsMiddleware: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const extendedFetcher = async (pageIndex: string) => {
        if (!fetcher) return null
        const { data: dataPublications } = await fetch('/api/getSubscribed')
            .then(res => res.json())
            .then(res => res)
        if (!dataPublications) return fetcher(pageIndex, [])
        const list: string[] = dataPublications?.reduce((prev: any, current: any) => [...prev, current.publication], [])
        return fetcher(pageIndex, list)
    }
    // @ts-ignore
    return useSWRNext(key, extendedFetcher, config)
}



const fetcher = async (index: string | null, list: string[]) => {
    try {
        if (index && parseInt(index) > 0) {
            const { data, error } = await supabase
                .from('mirroritems_test')
                .select('digest')
                .order('timestamp', { ascending: false })
                .eq('isPublished', true)
                .in('publication', list)
                .range(parseInt(index) + 1, parseInt(index) + 20)
            const newdata = data?.map(({ digest }) => digest) as EntryType['digest'][] | null
            if (error) return []
            return newdata
        } else {
            const { data, error } = await supabase
                .from('mirroritems_test')
                .select('digest')
                .order('timestamp', { ascending: false })
                .eq('isPublished', true)
                .in('publication', list)
                .limit(20)
            if (error) return []
            const newdata = data?.map(({ digest }) => digest) as EntryType['digest'][] | null
            return newdata
        }
    } catch (e) {
        throw e
    }
}



const RenderCard = ({ pathName }: { pathName: string }) => {
    const { data, error, isValidating, setSize } = useSWRInfinite<EntryType['digest'][] | null>((pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.length) return null // reached the end
        const key = 20 * pageIndex
        return [key.toString()]
    }, fetcher, { use: [getUserSubscribtionsMiddleware] }) // tslint:disable-line


    if (!data) return <Loader size='large' />
    if (error) return <Box>Something went wrong...Refresh the page  {JSON.stringify(error)}</Box>
    return (
        <GridPage
            pathName={pathName}
            data={data.flat()} error={error} isValidating={isValidating} setSize={setSize} />
    )
}



const Page = () => {
    const router = useRouter()

    return (
        <Layout>
            <Box width={'full'}>
                <Header pathName={router.pathname} />
                <RenderCard pathName={router.pathname} />
            </Box>
        </Layout>
    )
}



export default Page