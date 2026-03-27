package com.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Rooms")
public class Rooms {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer roomId;

    @Column(name = "room_no", nullable = false, length = 20)
    private String roomNo;

    @Column(name = "room_type", nullable = false, length = 20)
    private String roomType;

    @Column(name = "floor")
    private String floor;

    @Column(name = "current_occupants", columnDefinition = "INT DEFAULT 0")
    private Integer currentOccupants = 0;

    @Column(name = "monthly_rent", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "status", length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'available'")
    private String status = "available";

    @Column(name = "capacity", columnDefinition = "INT DEFAULT 0")
    private Integer capacity = 0;



    // Constructors
    public Rooms() {}

    public Rooms(String roomNo, String roomType, String floor, BigDecimal monthlyRent) {
        this.roomNo = roomNo;
        this.roomType = roomType;
        this.floor = floor;
        this.monthlyRent = monthlyRent;
        this.status = "available";
        this.currentOccupants = 0;
    }

    // Getters and Setters
    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomNo() {
        return roomNo;
    }

    public void setRoomNo(String roomNo) {
        this.roomNo = roomNo;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public Integer getCurrentOccupants() {
        return currentOccupants;
    }

    public void setCurrentOccupants(Integer currentOccupants) {
        this.currentOccupants = currentOccupants;
    }

    public BigDecimal getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(BigDecimal monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getCapacity() {
        return capacity;
    }
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
}