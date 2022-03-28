import { Button, IconMenu, Dropdown, DropdownItem, Stack, Box, Tag, Text, IconBookOpen, IconCollection } from 'design-system'
// import Link from 'next/link'
import { useRouter } from 'next/router'
import type { PublisherType } from 'types'
import Publisher from '@/components/Publisher'

const Menu = ({ publisher }: { publisher?: PublisherType }) => {
    
    const router = useRouter()
    const trigger =  <Button
            variant='tertiary'
            size='small'
            shape={'circle'}>
            <IconMenu />
        </Button>

    const triggerMobile =  <Button
    variant={'secondary'}
    tone={router.pathname !== '/about' ? 'blue' : 'pink' }
    size='small'
    >
        <Stack direction='horizontal' align='center' space={'1.5'}>
           <IconMenu size={'6'}/>
        {router.pathname !== '/about' ? 'Home' : 'About'}
        </Stack>
    </Button>

        
    return (
        <Box
            width='fit'
            height='fit'
            borderRadius={'2xLarge'}
        >
            <Stack direction={'horizontal'} align='center'>
                <Dropdown 
                width={{xs:'72', sm:'72', md:'64', lg:'64', xl:'64'}}
                trigger={
                    (router.pathname.split('/').includes('publication') || router.pathname.split('/').includes('member')) 
                    ? trigger 
                    : triggerMobile
                }>

                    <DropdownItem width='full'
                        size='small'
                        onClick={() => router.push('/')}
                        prefix={<IconCollection />}
                        variant={router.pathname === '' || router.pathname === '/' ? 'primary' : 'tertiary'}>
                        Feed
                    </DropdownItem>

                    <DropdownItem
                        disabled
                        onClick={() => router.push('/trending')}
                        width='full'
                        size='small'
                        variant={'secondary'}
                        prefix={<Tag size='small' tone={'blue'}>Soon</Tag>}
                    >
                        Trending
                    </DropdownItem>


                    <DropdownItem
                        onClick={() => router.push('/about')}
                        width='full'
                        size='small'
                        variant={router.pathname === '/about' ? 'primary' : 'tertiary'}
                        prefix={<IconBookOpen />}
                    >
                        About
                    </DropdownItem>

                </Dropdown>


                <Box
                    // display={{ sm: 'none', xs: 'none', md: 'none', lg: 'block', xl: 'block' }}
                    style={{ userSelect: 'none' }}
                >
                    {!publisher && (
                        <Box
                        width='fit'
                        display={{ sm: 'none', xs: 'none', md: 'none', lg: 'block', xl: 'block' }}
                        >
                        <Text
                            color='textTertiary'
                            weight={
                                'bold'
                            }
                            size='extraLarge'
                        >Mirrorfeed
                        </Text>
                        </Box>
                    )}
                    {publisher && (
                        <Publisher publisher={publisher} />
                    )}


                </Box>
            </Stack>
        </Box>
    )
}

export default Menu