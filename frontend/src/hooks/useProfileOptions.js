const useProfileOptions = () => {

  const schoolOptions = [
    { label: 'None', value: 0 },
    { label: 'CAS', value: 1 },
    { label: 'Gallatin', value: 2 },
    { label: 'Steinhardt', value: 3 },
    { label: 'Stern', value: 4 },
    { label: 'Tandon', value: 5 },
    { label: 'Tisch', value: 6 },
    { label: 'Graduate Program', value: 7 }
  ];

  const yearOptions = [
    { label: 'None', value: 0 },
    { label: 'Freshmen', value: 1 },
    { label: 'Sophomore', value: 2 },
    { label: 'Junior', value: 3 },
    { label: 'Senior', value: 4 },
    { label: 'Graduate Student', value: 5 },
    { label: 'Alumni', value: 6 }
  ];

  return { schoolOptions, yearOptions }
}

export default useProfileOptions