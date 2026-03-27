package com.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "Student")
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Integer studentId;
    
    @Column(name = "college_id", unique = true, length = 20)
    private String collegeId;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;
    
    @Column(name = "dob")
    private LocalDate dob;
    
    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "course", nullable = false)
    private Course course;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "stream", nullable = false)
    private Stream stream;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "year", nullable = false)
    private Year year;
    
    @Column(name = "email", unique = true, length = 100)
    private String email;
    
    @Column(name = "contact_no", nullable = false, length = 15)
    private String contactNo;
    
    @Column(name = "address", length = 100)
    private String address;
    
    @Column(name = "guardian_name", nullable = false, length = 100)
    private String guardianName;
    
    @Column(name = "guardian_contact", nullable = false, length = 15)
    private String guardianContact;
    
    @Column(name = "parent_name", length = 100)
    private String parentName;
    
    @Column(name = "parent_contact", length = 15)
    private String parentContact;
    
    @Column(name = "room_id", length = 10 ,nullable = true)
    private Integer roomId;
    
    @Column(name = "admission_fee", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean admissionFee = false;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
    
    // Enums
    public enum Gender { Male, Female, Other }
    public enum Course { BTech, MTech }
    public enum Stream { CSE, ECE, Civil, Mechanical, Electrical }
    public enum Year { First, Second, Third, Fourth }
    
    // Constructors
    public Student() {}
    
    // Registration constructor
    public Student(String collegeId, String name, Gender gender, 
                   Course course, Stream stream, Year year, 
                   String email, String contactNo, String guardianName, 
                   String guardianContact)
    {          
        this.collegeId = collegeId;
        this.name = name;
        this.gender = gender;
        this.course = course;
        this.stream = stream;
        this.year = year;
        this.email = email;
        this.contactNo = contactNo;
        this.guardianName = guardianName;
        this.guardianContact = guardianContact;
        this.admissionDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
    }
    
   
public Integer getStudentId() { 
    return studentId; 
}

  
public void setStudentId(Integer studentId)
 { 
    this.studentId = studentId;
 }

 public String getCollegeId()
    { 
        return collegeId;
    }

public void setCollegeId(String collegeId)
    { 
        this.collegeId = collegeId; 
    }

public String getName() 
{ 
    return name; 
}
public void setName(String name) 
{ 
    this.name = name; 
}   
public LocalDate getDob() 
{ 
    return dob; 
}

public void setDob(LocalDate dob) 
{ 
    this.dob = dob; 
}
public LocalDate getAdmissionDate() 
{ 
    return admissionDate; 
}

public void setAdmissionDate(LocalDate admissionDate) 
{ 
    this.admissionDate = admissionDate; 
}
public String getEmail() 
{ 
    return email; 
}
public void setEmail(String email) 
{ 
    this.email = email; 
}
public String getContactNo() 
{ 
    return contactNo; 
}
public void setContactNo(String contactNo) 
{ 
    this.contactNo = contactNo; 
}
public String getAddress() 
{ 
    return address; 
}
public void setAddress(String address) 
{ 
    this.address = address; 
}
public String getGuardianName() 
{ 
    return guardianName; 
}
public void setGuardianName(String guardianName) 
{ 
    this.guardianName = guardianName; 
}
public String getGuardianContact() 
{ 
    return guardianContact; 
}
public void setGuardianContact(String guardianContact) 
{ 
    this.guardianContact = guardianContact; 
}
public String getParentName() 
{ 
    return parentName; 
}
public void setParentName(String parentName) 
{ 
    this.parentName = parentName; 
}
public String getParentContact() 
{ 
    return parentContact; 
}
public void setParentContact(String parentContact) 
{ 
    this.parentContact = parentContact; 
}
public Integer getRoomId() 
{ 
    return roomId; 
}
public void setRoomId(Integer roomId) 
{ 
    this.roomId = roomId; 
}
public String getPassword() 
{ 
    return password; 
}

public void setPassword(String password) 
{ 
    this.password = password; 
}
public LocalDateTime getCreatedAt() 
{ 
    return createdAt; 
}
public void setCreatedAt(LocalDateTime createdAt) 
{ 
    this.createdAt = createdAt; 
}


public Boolean getAdmissionFee() { 
    return admissionFee; 
}

public void setAdmissionFee(Boolean admissionFee) 
{ 
    this.admissionFee = admissionFee; 
}


public Gender getGender() 
{
     return gender; 
}


public void setGender(Gender gender) 
{
     this.gender = gender; 
}

public Course getCourse() 
{
     return course;     

}

public void setCourse(Course course) 
{
     this.course = course; 
}

public Stream getStream() 
{
     return stream; 
}

public void setStream(Stream stream) 
{
     this.stream = stream; 
}

public Year getYear() 
{
     return year; 
}

public void setYear(Year year) 
{
     this.year = year; 
}
}



