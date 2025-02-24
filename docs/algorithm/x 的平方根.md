---
title: x 的平方根
createTime: 2025/02/24 23:06:03
permalink: /article/bw3yredc/
tags:
  - 二分
---
## [69. x 的平方根 ](https://leetcode.cn/problems/sqrtx/)

给你一个非负整数 `x` ，计算并返回 `x` 的 **算术平方根** 。

由于返回类型是整数，结果只保留 **整数部分** ，小数部分将被 **舍去 。**

**注意：**不允许使用任何内置指数函数和算符，例如 `pow(x, 0.5)` 或者 `x ** 0.5` 。

**示例 1：**

```
输入：x = 4
输出：2
```

**示例 2：**

```
输入：x = 8
输出：2
解释：8 的算术平方根是 2.82842..., 由于返回类型是整数，小数部分将被舍去。
```

**提示：**

- `0 <= x <= 2^31 - 1`

## 二分查找平方小于等于 x 的数的右边界

不需要判空检查，因为一定能找到，只有在可能找不到的时候才需要检查；

$x$ 平方根的整数部分 $ans$ 是满足 $k^2 \leq x$ 的最大 $k$ 值。

以下是三种二分查找的写法。

```java
class Solution {
    public int mySqrt(int x) {
        int l = 0, r = x, ans = -1;
        
        while (l <= r) {
            int mid = l + (r - l) / 2;
            // 必须是<=时更新ans，不能只在=x时更新ans，因为有些数开方后不是整数，例如8.
            if ((long) mid * mid <= x) {
                ans = mid;
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        
        return ans;
    }
}
```

```java
class Solution {
    public int mySqrt(int x) {
        int l = 0, r = x;
        
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if ((long) mid * mid <= x) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        // 注意，每轮循环后，[0,l-1]里全是小于等于x的数，[r+1, length-1]里全是>=x的数，[l,r]里是未确定的数
        return l-1;
    }
}
```

```java
class Solution {
    public int mySqrt(int x) {
        int l = 0, r = x, ans = -1;
        
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if ((long) mid * mid < x) {
                ans = mid;
                l = mid + 1;
            } else if ((long) mid * mid == x) {
                return mid;
            } else {
                r = mid - 1;
            }
        }
        return ans;
    }
}
```

- 时间复杂度：O(log x)，即为二分查找需要的次数。
- 空间复杂度：O(1)。

## 牛顿迭代

```java
class Solution {
    public int mySqrt(int x) {
        if (x == 0) {
            return 0;
        }

        // 计算sqrt{2}(C)，C=x
        double C = x, x0 = x; // 这里把int类型的x换成了double类型的x
        while (true) {
            double xi = 0.5 * (x0 + C / x0);
            // 当相邻两次迭代得到的交点非常接近时。注意这里的x0是上一轮的xi。
            if (Math.abs(x0 - xi) < 1e-7) {
                break;
            }
            // x0前进到xi处
            x0 = xi;
        }
        return (int) x0;
    }
}

// 返回xi也可以，但是要在break的时候返回，因为xi是局部变量
class Solution {
    public int mySqrt(int x) {
        if (x == 0) {
            return 0;
        }

        double C = x, x0 = x;
        while (true) {
            double xi = 0.5 * (x0 + C / x0);
            if (Math.abs(x0 - xi) < 1e-7) {
                return (int) xi;
            }
            x0 = xi;
        }
    }
}
```

- 时间复杂度：O(log x)，此方法是二次收敛的，相较于二分查找更快。
- 空间复杂度：O(1)。