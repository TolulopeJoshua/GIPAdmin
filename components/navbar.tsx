import { Fragment, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import toast from 'react-hot-toast'

import { useSelector, useDispatch } from 'react-redux';
import { docsActions } from '../store/index';
import proxy from '../utils/proxy'
import { docsState } from '../types'


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {

  const dispatch = useDispatch();
  const { auth } = useSelector(({ docs }: {docs: docsState}) => docs);

  function logout() {
    if (auth.name) {
      toast.loading('Logging out...')
      localStorage.removeItem('auth');
      const url = proxy + '/logout';
      axios.post(url, { email: auth.email }, { headers: {'Authorization': `Bearer ${auth.token}`}}).then(function(response) {
        dispatch(docsActions.resetStore({}))
        toast.dismiss();
        toast.success('Logged out successfully.')
      }).catch(function(error) {
        toast.dismiss()
        toast.error('An error occured!')
      })
      router.push('/');
    }
  }
    
  useEffect(() => {
    if (auth.name) {
      const url = proxy + '/all';
      toast.loading('Loading Documents...')
      dispatch(docsActions.setLoading(true))
      axios.get(url, { headers: {'Authorization': `Bearer ${auth.token}`}}).then(function (response) {
        dispatch(docsActions.setLoading(false))
        dispatch(docsActions.setDocs(response.data))
        toast.dismiss()
        toast.success(' Done. ')
      }).catch(function (error) {
        alert(JSON.stringify(error));
        dispatch(docsActions.setError(true))
        dispatch(docsActions.setLoading(false))
        toast.dismiss()
        toast.error('Error fetching data. Please reload.')
      }); 
    } else {
      try {
        const auth = JSON.parse(localStorage.getItem('auth') || '');
        if (auth && (Date.now() < auth.timeout)) dispatch(docsActions.setAuth(auth));
      } catch (error) {}
    }
  }, [auth])
  
  const router = useRouter();
  const {pathname, query} = useRouter();
  const page = pathname.split('/')[1] == '[folder]' ? query.folder : pathname.split('/')[1]
  const navigation = [
    { name: 'Dashboard', href: '/', current: pathname == '/' },
    { name: 'Books', href: '/books?isApproved=true', current: page == 'books' },
    { name: 'Biographies', href: '/biographies?isApproved=true', current: page == 'biographies' },
    { name: 'Articles', href: '/articles?isApproved=true', current: page == 'articles' },
  ] 

  return ( 
    <Disclosure as="nav" className="w-screen border-0 border-b-2 border-slate-500/70">
      {({ open }: { open: Boolean }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="block h-8 w-auto lg:hidden opacity-50"
                    src='/burningBook.jpg'
                    alt="GIP Library"
                    width={48}
                    height={48}
                  />
                  <Image
                    className="hidden h-8 w-auto lg:block opacity-50"
                    src='/burningBook.jpg'
                    alt="GIP Library"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="hidden sm:mx-[auto] sm:block">
                  <div className="flex space-x-4 py-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <span onClick={() => (!auth.name && router.push('/login'))} className='px-2 py-1 italic'>{ auth.name ? auth.name : 'Login'}</span>
                      {/* <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      /> */}
                    </Menu.Button>
                  </div>
                  {
                    auth.name &&
                    <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {/* <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item> */}
                      {/* <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item> */}
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={logout}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 select-none')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>}
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="div"
                  // href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <Link href={item.href}>{item.name}</Link>
                  
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
