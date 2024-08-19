const useProfileOptions = () => {

  const schoolOptions = [
    { label: 'CAS', value: 0 },
    { label: 'Gallatin', value: 1 },
    { label: 'Steinhardt', value: 2 },
    { label: 'Stern', value: 3 },
    { label: 'Tandon', value: 4 },
    { label: 'Tisch', value: 5 },
    { label: 'Graduate Program', value: 6 },
    { label: 'None', value: 7 },
  ];

  const yearOptions = [
    { label: 'Freshmen', value: 0 },
    { label: 'Sophomore', value: 1 },
    { label: 'Junior', value: 2 },
    { label: 'Senior', value: 3 },
    { label: 'Graduate Student', value: 4 },
    { label: 'Alumni', value: 5 },
    { label: 'None', value: 6 },
  ];

  return { schoolOptions, yearOptions }
}

export default useProfileOptions